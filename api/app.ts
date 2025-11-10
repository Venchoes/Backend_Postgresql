import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import connectToDatabase from './database/connection.database';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import tasksRoutes from './routes/tasks.routes';
import errorHandler from './middlewares/errorHandler.middleware';
import { Request, Response } from 'express';

const app = express();

// Inicializa conexão (não bloqueia produção em caso de falha quando NODE_ENV !== 'production')
connectToDatabase();

// Middlewares
// Habilita JSON body parsing
app.use(express.json());

// Configuração de CORS:
// - Se CORS_ORIGIN estiver definido no .env, aceita apenas origens listadas (separadas por vírgula).
// - Caso contrário, aceita a origem da requisição (útil para desenvolvimento em subdomínios dinâmicos).
const corsOptionOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : null;

app.use(
  cors()
);

// Healthcheck simples
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: '🚀 Projeto Backend com Express e PostgreSQL funcionando corretamente :)!',
    status: 'WORKING',
  });
});

// Rotas
app.use('/', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/tasks', tasksRoutes);

// Error handler
app.use(errorHandler);

export default app;
