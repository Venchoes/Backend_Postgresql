import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Conexão secundária para dual sync
let secondaryConnection: mongoose.Connection | null = null;

const getSecondaryConnection = () => secondaryConnection;

const connectToDatabase = async () => {
    try {
    const dualSync = process.env.MONGODB_DUAL_SYNC === 'true';
    const uriLocal = process.env.MONGODB_URI_LOCAL;
    const uriAtlas = process.env.MONGODB_URI_ATLAS;
    const uriSingleLegacy = process.env.MONGODB_URI; // compatibilidade com projetos anteriores

        if (dualSync) {
            console.log('[DATABASE] Modo DUAL SYNC ativado - conectando aos dois bancos...');

            let primaryOk = false;
            let secondaryOk = false;

            // Conecta ao Atlas na conexão principal (tenta, mas não derruba se falhar)
            if (uriAtlas || uriSingleLegacy) {
                try {
                    console.log('[DATABASE] Conectando ao MongoDB Atlas...');
                    await mongoose.connect(uriAtlas || (uriSingleLegacy as string));
                    console.log('[DATABASE] ✅ Conectado ao MongoDB Atlas');
                    primaryOk = true;
                } catch (err) {
                    console.error('[DATABASE] ⚠️ Falha ao conectar no Atlas:', err instanceof Error ? err.message : String(err));
                }
            }

            // Conecta ao Local na conexão secundária (tenta, mas não derruba se falhar)
            if (uriLocal || uriSingleLegacy) {
                try {
                    console.log('[DATABASE] Conectando ao MongoDB Local...');
                    secondaryConnection = mongoose.createConnection(uriLocal || (uriSingleLegacy as string) || 'mongodb://localhost:27017/backend_mongodb');
                    await new Promise<void>((resolve, reject) => {
                        const timeout = setTimeout(() => reject(new Error('Timeout connecting to Local DB')), 10000);
                        secondaryConnection!.on('connected', () => {
                            clearTimeout(timeout);
                            resolve();
                        });
                        secondaryConnection!.on('error', (err) => {
                            clearTimeout(timeout);
                            reject(err);
                        });
                    });
                    console.log('[DATABASE] ✅ Conectado ao MongoDB Local');
                    secondaryOk = true;

                    // Se Atlas falhou mas o Local subiu, vincular a conexão padrão ao Local
                    if (!primaryOk) {
                        try {
                            console.log('[DATABASE] Definindo conexão padrão para o MongoDB Local (fallback) ...');
                            await mongoose.connect(uriLocal || (uriSingleLegacy as string) || 'mongodb://localhost:27017/backend_mongodb');
                            console.log('[DATABASE] ✅ Conexão padrão agora aponta para Local');
                        } catch (err2) {
                            console.error('[DATABASE] ❌ Falha ao ajustar conexão padrão para Local:', err2 instanceof Error ? err2.message : String(err2));
                        }
                    }
                } catch (err) {
                    console.error('[DATABASE] ⚠️ Falha ao conectar no MongoDB Local:', err instanceof Error ? err.message : String(err));
                }
            }

            if (!primaryOk && !secondaryOk) {
                throw new Error('[DATABASE] Nenhuma conexão pôde ser estabelecida (Atlas e Local falharam).');
            }

            console.log('[DATABASE] ✅ Dual Sync configurado (Atlas:', primaryOk, ', Local:', secondaryOk, ')');
        } else {
            // Modo single (conecta apenas a um)
            const uri = uriAtlas || uriLocal || uriSingleLegacy || 'mongodb://localhost:27017/backend_mongodb';
            console.log('[DATABASE] Conectando ao MongoDB...');
            await mongoose.connect(uri);
            console.log('[DATABASE] ✅ Conexão estabelecida');
        }
    } catch (error) {
        console.error('[DATABASE] ❌ Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};

export { secondaryConnection, getSecondaryConnection };
export default connectToDatabase;