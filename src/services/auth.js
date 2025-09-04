import createHttpError from "http-errors";
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { User } from "../db/models/user.js";
import { Session } from "../db/models/session.js";
import { FIFTEEN_MINUTES, SMTP, TEMPLATES_DIR, THIRTY_DAYS } from "../constans/index.js";
import { sendEmail } from "../utils/sendMail.js";
import { getEnvVar } from "../utils/getEnvVar.js";


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



export const sendResetEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign({
        sub: user._id,
        email,
        secure: true
    },
        getEnvVar('JWT_SECRET'),
        {
            expiresIn: '5m',
        },
    );
    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html'
    );
    const templateSource = ((await fs.readFile(resetPasswordTemplatePath)).toString());

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
        from: getEnvVar(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
};


export const resetPassword = async ({token, password}) => {
    let entries;
    try {
        entries = jwt.verify(token, getEnvVar('JWT_SECRET'));
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, "Token is expired or invalid.");
    }

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

await User.updateOne(
    { _id: user._id },
    { $set: { password: encryptedPassword } },
);
await Session.deleteMany({ userId: user._id });
};
