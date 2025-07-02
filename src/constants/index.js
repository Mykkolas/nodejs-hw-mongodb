import path from 'node:path';

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;


export const SMTP_HOST = 'SMTP_HOST';
export const SMTP_PORT = 'SMTP_PORT';
export const SMTP_USER = 'SMTP_USER';
export const SMTP_PASSWORD = 'SMTP_PASSWORD';
export const SMTP_FROM = 'SMTP_FROM';


export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const CLOUDINARY = {
    CLOUD_NAME: 'CLOUD_NAME',
    API_KEY: 'API_KEY',
    API_SECRET: 'API_SECRET',
};

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
