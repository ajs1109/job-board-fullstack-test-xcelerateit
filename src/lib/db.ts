// src/lib/db.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import PG from 'pg';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '@/utils/config';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres', 
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