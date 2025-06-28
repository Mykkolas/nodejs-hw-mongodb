import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import getEnvVar from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from "cookie-parser";
/* import dotenv from 'dotenv'; */

export const setupServer = () => {
    const app = express();
    const PORT = Number(getEnvVar('PORT', 3000));
    app.use(cors());
    /* dotenv.config(); */
    app.use(cookieParser());
    app.use(
        express.json({
            type: ['application/json', 'application/vnd.api+json'],
        }),
    );

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            }
        })
    );

    app.use(router); // for my own routes

    app.use(notFoundHandler);
    app.use(errorHandler);
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
};