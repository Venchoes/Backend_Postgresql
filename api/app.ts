import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import tasksRoutes from './routes/tasks.routes';
import errorHandler from './middlewares/errorHandler.middleware';
import { Request, Response } from 'express';

const app = express();

// A inicialização da conexão com o DB é feita no startup do servidor
// (em `server.ts`) — assim garantimos que o DataSource esteja
// inicializado antes de aceitar requisições que acessam entidades.

app.use(cors());

// Habilita JSON body parsing
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
