import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/users.js";
import bcrypt from "bcrypt";
import { SessionsCollection } from "../db/models/sessions.js";
import { randomBytes } from "crypto";
import { FIFTEEN_MINUTES, SMTP_FROM, TEMPLATES_DIR, THIRTY_DAYS } from "../constants/index.js";
import getEnvVar from "../utils/getEnvVar.js";
import { sendEmail } from "../utils/sendMail.js";
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';


const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    };
};


export const registerUser = async (payload) => {

    const existingUser = await UsersCollection.findOne({
        email: payload.email
    });
    if (existingUser) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await UsersCollection.create({
        ...payload,
        password: encryptedPassword
    });
    return newUser;
};

export const loginUser = async (payload) => {
    console.log(payload);

    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user || !(await bcrypt.compare(payload.password, user.password))) {
        throw createHttpError(401, 'Invalid email or password'); // avoiding giving info to potential hackers with unclear message
    }

    await SessionsCollection.deleteOne({ userId: user._id });

    const session = createSession();

    return await SessionsCollection.create({
        userId: user._id,
        ...session
    });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
        _id: sessionId,
        refreshToken
    });
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await SessionsCollection.deleteOne({
        _id: sessionId,
        refreshToken
    });

    return await SessionsCollection.create({
        userId: session.userId,
        ...newSession
    });

};

export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
    const user = await UsersCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        getEnvVar('JWT_SECRET'),
        {
            expiresIn: '15m',
        },
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    try {
        await sendEmail({
            from: getEnvVar(SMTP_FROM),
            to: email,
            subject: 'Reset your password',
            html
        });
    }
    catch (err) {
        console.error("Email sending failed:", err);
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};

export const resetPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    }
    catch (err) {
        if (err instanceof Error) {
            throw createHttpError(401, err.message);
        }
    }

    const existingUser = await UsersCollection.findOne({
        email: entries.email,
        _id: entries.sub
    });

    if (!existingUser) {
        throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await UsersCollection.updateOne({
        _id: existingUser._id,
    },
        {
            password: encryptedPassword
        });
};