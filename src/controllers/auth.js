import { loginUser, logoutUser, refreshUserSession, registerUser } from "../services/auth.js";
import { THIRTY_DAYS } from "../constants/index.js";

const setupSession = (res, session) => {
    res.cookie('sessionId', session._id, {
        httpOnly: true, // preventing attacks through JS
        expires: new Date(Date.now() + THIRTY_DAYS)
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS)
    });
};


export const registerUserController = async (req, res) => {
    const newUser = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: newUser
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully logged in a user!',
        data: {
            accessToken: session.accessToken
        }
    });
};

export const refreshUserSessionController = async (req, res) => {

    const session = await refreshUserSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken
    });

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken
        }
    });
};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
};