import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    return res.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
        const status = error.status || 500;
        if (status >= 500) {
            console.error('[REGISTER ERROR]', error);
        }
        return res.status(status).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        return res.status(200).json({ token });
    } catch (error: any) {
        const status = error.status || 500;
        if (status >= 500) {
            console.error('[LOGIN ERROR]', error);
        }
        return res.status(status).json({ error: error.message });
    }
};