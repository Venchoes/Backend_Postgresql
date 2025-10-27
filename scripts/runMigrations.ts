import 'reflect-metadata';
import { getDataSource } from '../api/database/connection.database';

(async () => {
  try {
    const ds = getDataSource();
    if (!ds.isInitialized) {
      console.log('[MIGRATION] Inicializando DataSource...');
      await ds.initialize();
    }
    console.log('[MIGRATION] Executando migrations...');
    const results = await ds.runMigrations();
    results.forEach(r => console.log(`[MIGRATION] Executada: ${r.name}`));
    console.log('[MIGRATION] ✅ Todas as migrations executadas');
    await ds.destroy();
  } catch (err) {
    console.error('[MIGRATION] ❌ Falha ao executar migrations:', err);
    process.exit(1);
  }
})();
