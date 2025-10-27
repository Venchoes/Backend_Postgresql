"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const user_model_1 = require("../models/user.model");
const task_model_1 = require("../models/task.model");
dotenv_1.default.config();
let AppDataSource;
const getDataSource = () => {
    if (!AppDataSource) {
        const isProd = process.env.NODE_ENV === 'production';
        const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
        const synchronize = process.env.TYPEORM_SYNCHRONIZE
            ? process.env.TYPEORM_SYNCHRONIZE === 'true'
            : !isProd; // por padrão, sincroniza em dev e desliga em prod
        const sslEnabled = process.env.POSTGRES_SSL === 'true';
        const rejectUnauthorized = process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== 'false';
        const baseOptions = {
            type: 'postgres',
            synchronize,
            logging: process.env.TYPEORM_LOGGING === 'true' || false,
            entities: [user_model_1.User, task_model_1.Task],
            migrations: [
                // Suporta ts em dev e js em build
                path_1.default.join(__dirname, 'migrations/*.{ts,js}')
            ],
        };
        if (url) {
            AppDataSource = new typeorm_1.DataSource({
                ...baseOptions,
                url,
                ssl: sslEnabled ? { rejectUnauthorized } : undefined,
                extra: {
                    ssl: sslEnabled ? { rejectUnauthorized } : undefined,
                    max: Number(process.env.POSTGRES_POOL_SIZE || 10),
                },
            });
        }
        else {
            AppDataSource = new typeorm_1.DataSource({
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
exports.getDataSource = getDataSource;
const connectToDatabase = async () => {
    try {
        const ds = (0, exports.getDataSource)();
        if (!ds.isInitialized) {
            console.log('[DATABASE] Conectando ao PostgreSQL...');
            await ds.initialize();
            console.log('[DATABASE] ✅ Conexão estabelecida com PostgreSQL');
        }
    }
    catch (error) {
        console.error('[DATABASE] ❌ Erro ao conectar ao PostgreSQL:', error);
        process.exit(1);
    }
};
exports.default = connectToDatabase;
