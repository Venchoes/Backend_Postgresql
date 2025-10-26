import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../types/index';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret in production

export const generateToken = (userId: string): string => {
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
    return token;
};

export const verifyToken = (token: string): UserPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
        return decoded || null;
    } catch (error) {
        return null;
    }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    const decoded = verifyToken(token);
    if (!decoded) return res.sendStatus(403); // Forbidden

    (req as any).user = decoded; // Attach user info to request
    next();
};