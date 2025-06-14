import { HttpError } from 'http-errors';

export const errorHandler = async (err, req, res, next) => {
    const { status, message } = err;
    if (err instanceof HttpError) {
        res.status(status).json({
            status,
            message,
            data: err
        });
        return;
    };
    res.status(500).json({
        status: 500,
        message: 'Something went wrong',
        data: message,
    });
};