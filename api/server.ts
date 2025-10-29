import app from './app';

const PORT = process.env.PORT || 3000;

console.log('[SERVER] Iniciando servidor...');
console.log('[SERVER] Ambiente:', process.env.NODE_ENV || 'development');

app.listen(PORT, () => {
  console.log(`[SERVER] ✅ Servidor rodando em http://localhost:${PORT}`);
  console.log('[SERVER] Endpoints disponíveis:');
  console.log('[SERVER]   POST /register');
  console.log('[SERVER]   POST /login');
  console.log('[SERVER]   GET /protected');
  console.log('[SERVER]   CRUD /tasks');
});