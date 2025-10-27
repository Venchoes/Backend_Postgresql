import 'reflect-metadata';
import { getDataSource } from '../api/database/connection.database';

(async () => {
  try {
    const ds = getDataSource();
    if (!ds.isInitialized) {
      console.log('[MIGRATION] Inicializando DataSource...');
      await ds.initialize();
    }
    console.log('[MIGRATION] Revertendo última migration...');
    await ds.undoLastMigration();
    console.log('[MIGRATION] ✅ Última migration revertida');
    await ds.destroy();
  } catch (err) {
    console.error('[MIGRATION] ❌ Falha ao reverter migration:', err);
    process.exit(1);
  }
})();
