// src/lib/db.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import PG from 'pg';

// Load environment variables
dotenv.config();

// Get database connection variables from environment
const DB_NAME = process.env.DB_NAME || 'yourdbname';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');

// Create Sequelize instance - note that we're fixing the syntax here
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres', // This was incorrectly followed by another object before
  dialectModule: PG,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Call test connection in development
if (process.env.NODE_ENV === 'development') {
  testConnection();
}

export default sequelize;