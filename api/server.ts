import 'reflect-metadata';
import express from 'express';
import connectToDatabase from './database/connection.database';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import tasksRoutes from './routes/tasks.routes';
import errorHandler from './middlewares/errorHandler.middleware';
import { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

console.log('[SERVER] Iniciando servidor...');
console.log('[SERVER] Ambiente:', process.env.NODE_ENV || 'development');

// Connect to the database
connectToDatabase();

// Configure the Express application
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ 
    message: '🚀 Projeto Backend com Express e PostgreSQL funcionando corretamente :)!',
    status: 'WORKING',
  });

});

// Rotas (MVP requer /register, /login e /protected)
app.use('/', authRoutes); // POST /register, POST /login
app.use('/protected', protectedRoutes); // GET /protected
app.use('/tasks', tasksRoutes); // CRUD de tarefas (protegido)

// Middleware de erro
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`[SERVER] ✅ Servidor rodando em http://localhost:${PORT}`);
    console.log('[SERVER] Endpoints disponíveis:');
    console.log('[SERVER]   POST /register');
    console.log('[SERVER]   POST /login');
    console.log('[SERVER]   GET /protected');
  console.log('[SERVER]   CRUD /tasks');
});