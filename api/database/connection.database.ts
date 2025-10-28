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

    // Detecta necessidade de SSL automaticamente para URLs remotas (não localhost)
    const rejectUnauthorized = process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== 'false';
  let sslEnabled = process.env.POSTGRES_SSL === 'true';
    try {
      if (!sslEnabled && url) {
        const parsed = new URL(url);
        const host = parsed.hostname?.toLowerCase();
        const isLocal = host === 'localhost' || host === '127.0.0.1';
        const urlRequestsSSL = url.includes('sslmode=require');
        const envRequestsSSL = process.env.PGSSLMODE === 'require' || process.env.DATABASE_SSL === 'true';
        // Habilita SSL automaticamente para bancos remotos quando em produção
        sslEnabled = urlRequestsSSL || envRequestsSSL || (!isLocal && isProd);
      }
    } catch (_) {
      // Se a URL não puder ser parseada, mantém configuração padrão
    }

    // Se estiver usando host/port e o host não for local, habilita SSL automaticamente em produção
    if (!url) {
      const host = (process.env.POSTGRES_HOST || 'localhost').toLowerCase();
      const isLocal = host === 'localhost' || host === '127.0.0.1';
      if (!sslEnabled && !isLocal && isProd) {
        sslEnabled = true;
      }
    }
    // Caso esteja usando host/port e o host seja remoto (não localhost), habilita SSL automaticamente
    if (!url && !sslEnabled) {
      const hostEnv = (process.env.POSTGRES_HOST || '').toLowerCase();
      const isLocalHost = hostEnv === 'localhost' || hostEnv === '127.0.0.1' || hostEnv === '';
      if (!isLocalHost) {
        sslEnabled = true;
      }
    }

    const isTsRuntime = __filename.endsWith('.ts');
    const migrationsGlob = isTsRuntime
      ? path.resolve(process.cwd(), 'api/database/migrations/*.ts')
      : path.resolve(process.cwd(), 'dist/database/migrations/*.js');
    const baseOptions: any = {
      type: 'postgres',
      synchronize,
      logging: process.env.TYPEORM_LOGGING === 'true' || false,
      entities: [User, Task],
      migrations: [
        // Usa caminhos absolutos estáveis para evitar conflitos entre src e dist
        migrationsGlob
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
      // Log simples para depuração de SSL/host
      const usingUrl = !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);
      if (usingUrl) {
        try {
          const u = new URL(process.env.POSTGRES_URL || process.env.DATABASE_URL!);
          console.log(`[DATABASE] Conectando ao PostgreSQL... (via DATABASE_URL host=${u.hostname}, ssl=${process.env.POSTGRES_SSL || 'auto'})`);
        } catch {
          console.log('[DATABASE] Conectando ao PostgreSQL... (via DATABASE_URL)');
        }
      } else {
        console.log(`[DATABASE] Conectando ao PostgreSQL... (via host/port host=${process.env.POSTGRES_HOST || 'localhost'} port=${process.env.POSTGRES_PORT || '5432'} ssl=${process.env.POSTGRES_SSL || 'disabled'})`);
      }
      await ds.initialize();
      console.log('[DATABASE] ✅ Conexão estabelecida com PostgreSQL');
    }
  } catch (error) {
    console.error('[DATABASE] ❌ Erro ao conectar ao PostgreSQL:', error);
    // Em desenvolvimento, não derruba o servidor para permitir testes de rotas básicas/saúde
    if ((process.env.NODE_ENV || 'development') === 'production') {
      process.exit(1);
    } else {
      console.warn('[DATABASE] Continuando sem banco de dados (modo desenvolvimento). Algumas rotas podem falhar).');
    }
  }
};

export default connectToDatabase;