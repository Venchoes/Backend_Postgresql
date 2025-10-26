"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret in production
const generateToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded || null;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401); // Unauthorized
    const decoded = (0, exports.verifyToken)(token);
    if (!decoded)
        return res.sendStatus(403); // Forbidden
    req.user = decoded; // Attach user info to request
    next();
};
exports.authenticateToken = authenticateToken;
