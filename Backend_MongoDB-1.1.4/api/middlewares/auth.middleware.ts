import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('[AUTH] ❌ Token não fornecido');
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: jwt.VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
            console.log('[AUTH] ❌ Token inválido:', err.message);
            return res.status(401).json({ error: 'Token inválido' });
        }

        (req as any).user = decoded as JwtPayload; // Adiciona o usuário decodificado à requisição
        console.log('[AUTH] ✅ Token válido para:', (decoded as any)?.email);
        next();
    });
};