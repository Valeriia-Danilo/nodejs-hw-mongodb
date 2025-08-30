import createHttpError from "http-errors";
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { User } from "../db/models/user.js";
import { Session } from "../db/models/session.js";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constans/index.js";


export const registerUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return User.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });

    if (!user) {
        throw createHttpError(401, 'User not found');
    };

    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
        throw createHttpError(401, 'User is unauthorized');
    };

    await Session.deleteOne({ userId: user._id });

    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');

    return Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
};

const createSession = (userId) => {

    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
        userId,
    };
};


export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) throw createHttpError(401, 'Session not found');

    if (session.refreshTokenValidUntil < new Date()) {
    await Session.findByIdAndDelete(sessionId);
    throw createHttpError(401, 'Session expired!');
    }

    const user = await User.findById(session.userId);

  if (!user) {
    await Session.findByIdAndDelete(sessionId);
    throw createHttpError(401, 'Session not found!');
  }

    const newSession = createSession(user._id);

await Session.deleteOne({ _id: sessionId, refreshToken });


    return await Session.create({
        userId: session.userId,
        ...newSession,
    });
};

export const logoutUser = async (sessionId) => {
    await Session.deleteOne({_id: sessionId});
};
