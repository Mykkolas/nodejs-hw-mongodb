//@ts-nocheck

import nodemailer from 'nodemailer';

import getEnvVar from './getEnvVar.js';
import { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from '../constants/index.js';

const transporter = nodemailer.createTransport({
    host: getEnvVar(SMTP_HOST),
    port: Number(getEnvVar(SMTP_PORT)),
    auth: {
        user: getEnvVar(SMTP_USER),
        pass: getEnvVar(SMTP_PASSWORD),
    },
});

export const sendEmail = async (options) => {
    return await transporter.sendMail(options);
};
