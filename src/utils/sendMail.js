import nodemailer from 'nodemailer';

import { SMTP } from '../constans/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
    host: getEnvVar(SMTP.SMTP_HOST),
    port: Number(getEnvVar(SMTP.SMTP_PORT)),
    auth: {
        user: getEnvVar(SMTP.SMTP_USER),
        pass: getEnvVar(SMTP.SMTP_PASSWORD),
    },
    tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (options) => {
    return await transporter.sendMail(options).catch(() => {
      throw createHttpError(
        500,
        "Failed to send the email, please try again later."
      );
    });;
};
