const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
