"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('[AUTH] ❌ Token não fornecido');
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('[AUTH] ❌ Token inválido:', err.message);
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.user = decoded; // Adiciona o usuário decodificado à requisição
        console.log('[AUTH] ✅ Token válido para:', decoded?.email);
        next();
    });
};
exports.authMiddleware = authMiddleware;
