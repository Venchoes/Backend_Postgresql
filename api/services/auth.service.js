"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_util_1 = require("../utils/logger.util");
const exceptions_util_1 = require("../utils/exceptions.util");
const connection_database_1 = require("../database/connection.database");
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const registerUser = async (name, email, password) => {
    // Validações básicas para 422
    if (!name || name.length < 3)
        throw new exceptions_util_1.UnprocessableEntityException('Nome deve ter pelo menos 3 caracteres');
    if (!email || !/.+@.+\..+/.test(email))
        throw new exceptions_util_1.UnprocessableEntityException('E-mail inválido');
    if (!password || password.length < 6)
        throw new exceptions_util_1.UnprocessableEntityException('Senha deve ter pelo menos 6 caracteres');
    const ds = (0, connection_database_1.getDataSource)();
    const repo = ds.getRepository(user_model_1.User);
    const exists = await repo.findOne({ where: { email }, select: ['id'] });
    if (exists)
        throw new exceptions_util_1.ConflictException('E-mail já existente');
    const newUser = repo.create({ name, email, password });
    await repo.save(newUser);
    logger_util_1.logger.info(`User registered in PostgreSQL: ${email}`);
    return newUser;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    if (!email || !/.+@.+\..+/.test(email))
        throw new exceptions_util_1.BadRequestException('E-mail inválido');
    if (!password)
        throw new exceptions_util_1.BadRequestException('Senha inválida');
    const ds = (0, connection_database_1.getDataSource)();
    const repo = ds.getRepository(user_model_1.User);
    const user = await repo.findOne({ where: { email } });
    if (!user) {
        logger_util_1.logger.warn(`Login failed: User not found for email ${email}`);
        throw new exceptions_util_1.NotFoundException('Usuário não encontrado');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        logger_util_1.logger.warn(`Login failed: Invalid password for email ${email}`);
        throw new exceptions_util_1.UnauthorizedException('Senha incorreta');
    }
    const token = (0, jsonwebtoken_1.sign)({ id: String(user.id), email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    logger_util_1.logger.info(`User logged in: ${email}`);
    return token;
};
exports.loginUser = loginUser;
const verifyToken = (token) => {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
        logger_util_1.logger.info(`Token verified for user: ${decoded.email}`);
        return decoded;
    }
    catch (error) {
        logger_util_1.logger.error('Token verification failed:', error);
        return null;
    }
};
exports.verifyToken = verifyToken;
