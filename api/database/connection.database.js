"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const user_model_1 = require("../models/user.model");
const task_model_1 = require("../models/task.model");
dotenv_1.default.config();
let AppDataSource;
const getDataSource = () => {
    if (!AppDataSource) {
        AppDataSource = new typeorm_1.DataSource({
            type: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: Number(process.env.POSTGRES_PORT || 5432),
            username: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'postgres',
            database: process.env.POSTGRES_DB || 'appdb',
            synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || true,
            logging: false,
            entities: [user_model_1.User, task_model_1.Task],
        });
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
