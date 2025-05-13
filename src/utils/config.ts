import dotenv from 'dotenv';

dotenv.config();

export const DB_NAME = process.env.DB_NAME || 'yourdbname';
export const DB_USER = process.env.DB || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT || '5432');
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '2days';
export const NODE_ENV = 'production';
export const SERVER_URI = 'https://job-board-fullstack-test-new-748480980728.us-central1.run.app';