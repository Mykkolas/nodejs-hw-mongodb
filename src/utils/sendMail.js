
import nodemailer from 'nodemailer';

import getEnvVar from './getEnvVar.js';

const transporter = nodemailer.createTransport({
    host: getEnvVar("SMTP_HOST"),
    port: Number(getEnvVar("SMTP_PORT")),
    auth: {
        user: getEnvVar("SMTP_USER"),
        pass: getEnvVar("SMTP_PASSWORD"),
    },
});
/* const check = getEnvVar("SMTP_HOST");
console.log(check); */


export const sendEmail = async (options) => {
    return await transporter.sendMail(options);
};
