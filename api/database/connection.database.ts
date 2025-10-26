import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';

dotenv.config();

let AppDataSource: DataSource;

export const getDataSource = (): DataSource => {
  if (!AppDataSource) {
    AppDataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'appdb',
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || true, // habilita auto-sync em dev
      logging: false,
      entities: [User, Task],
    });
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