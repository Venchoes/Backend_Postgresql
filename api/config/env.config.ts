import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
};

export default envConfig;