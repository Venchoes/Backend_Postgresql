import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';

dotenv.config();

let AppDataSource: DataSource;

export const getDataSource = (): DataSource => {
  if (!AppDataSource) {
    const isProd = process.env.NODE_ENV === 'production';
    const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    const synchronize = process.env.TYPEORM_SYNCHRONIZE
      ? process.env.TYPEORM_SYNCHRONIZE === 'true'
      : !isProd; // por padrão, sincroniza em dev e desliga em prod

    const sslEnabled = process.env.POSTGRES_SSL === 'true';
    const rejectUnauthorized = process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== 'false';

    const baseOptions: any = {
      type: 'postgres',
      synchronize,
      logging: process.env.TYPEORM_LOGGING === 'true' || false,
      entities: [User, Task],
      migrations: [
        // Suporta ts em dev e js em build
        path.join(__dirname, 'migrations/*.{ts,js}')
      ],
    };

    if (url) {
      AppDataSource = new DataSource({
        ...baseOptions,
        url,
        ssl: sslEnabled ? { rejectUnauthorized } : undefined,
        extra: {
          ssl: sslEnabled ? { rejectUnauthorized } : undefined,
          max: Number(process.env.POSTGRES_POOL_SIZE || 10),
        },
      });
    } else {
      AppDataSource = new DataSource({
        ...baseOptions,
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT || 5432),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'appdb',
        ssl: sslEnabled ? { rejectUnauthorized } : undefined,
        extra: {
          ssl: sslEnabled ? { rejectUnauthorized } : undefined,
          max: Number(process.env.POSTGRES_POOL_SIZE || 10),
        },
      });
    }
  }
  return AppDataSource;
};

const connectToDatabase = async () => {
  try {
    const ds = getDataSource();
    if (!ds.isInitialized) {
      console.log('[DATABASE] Conectando ao PostgreSQL...');
      await ds.initialize();
      console.log('[DATABASE] ✅ Conexão estabelecida com PostgreSQL');
    }
  } catch (error) {
    console.error('[DATABASE] ❌ Erro ao conectar ao PostgreSQL:', error);
    process.exit(1);
  }
};

export default connectToDatabase;