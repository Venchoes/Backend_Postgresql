import { Request, Response } from 'express';

export const protectedRouteHandler = (req: Request, res: Response) => {
    const user = (req as any).user;
    console.log('[PROTECTED] Acesso autorizado para usuário:', user?.email || user?.id);
    res.status(200).json({ message: 'Acesso autorizado' });
};