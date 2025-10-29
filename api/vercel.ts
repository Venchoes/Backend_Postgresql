import app from './app';

// Exporta um handler explícito para evitar qualquer ambiguidade de default export
// em alguns ambientes/builders da Vercel
export default function handler(req: any, res: any) {
	return (app as any)(req, res);
}
