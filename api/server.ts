import 'reflect-metadata';
import app from './app';
import connectToDatabase from './database/connection.database';

const PORT = process.env.PORT || 3000;

(async () => {
  console.log('[SERVER] Iniciando servidor...');
  console.log('[SERVER] Ambiente:', process.env.NODE_ENV || 'development');

  // Aguarda inicialização do DataSource antes de aceitar requisições.
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`[SERVER] ✅ Servidor rodando em http://localhost:${PORT}`);
    console.log('[SERVER] Endpoints disponíveis:');
    console.log('[SERVER]   POST /register');
    console.log('[SERVER]   POST /login');
    console.log('[SERVER]   GET /protected');
    console.log('[SERVER]   CRUD /tasks');
  });
})();
