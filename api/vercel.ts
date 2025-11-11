import 'reflect-metadata';
import app from './app';
import connectToDatabase from './database/connection.database';

// Variável para garantir que a conexão seja inicializada apenas uma vez
let isDbInitialized = false;

// Exporta um handler explícito para evitar qualquer ambiguidade de default export
// em alguns ambientes/builders da Vercel
export default async function handler(req: any, res: any) {
    // Inicializa o banco de dados na primeira execução da função serverless
    if (!isDbInitialized) {
        await connectToDatabase();
        isDbInitialized = true;
    }
    
    return (app as any)(req, res);
}
