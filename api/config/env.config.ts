import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN || 3600),
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: Number(process.env.POSTGRES_PORT || 5432),
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
  POSTGRES_DB: process.env.POSTGRES_DB || 'appdb',
};

export default envConfig;