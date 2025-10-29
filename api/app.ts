import 'reflect-metadata';
import express from 'express';
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
app.use(express.json());

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
