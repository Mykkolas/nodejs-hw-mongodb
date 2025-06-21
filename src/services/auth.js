import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/users.js";
import bcrypt from "bcrypt";
import { SessionsCollection } from "../db/models/sessions.js";
import { randomBytes } from "crypto";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";

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