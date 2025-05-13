// src/lib/db.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables
dotenv.config();

// Use the pooled connection URL from Neon
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || "postgres://neondb_owner:npg_WYJsw0ckHy2b@ep-mute-tree-a4wa6s0d-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required');
}

// Create Sequelize instance with Neon connection
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectModule: pg, // Use the pg package
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // For Neon's SSL
    }
  },
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
    
    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit if DB connection fails
  }
};

testConnection();

export default sequelize;