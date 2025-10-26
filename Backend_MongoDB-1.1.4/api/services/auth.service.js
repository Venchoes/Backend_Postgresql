"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_util_1 = require("../utils/logger.util");
const dotenv_1 = __importDefault(require("dotenv"));
const exceptions_util_1 = require("../utils/exceptions.util");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const DUAL_SYNC = process.env.MONGODB_DUAL_SYNC === 'true';
const registerUser = async (name, email, password) => {
    // Validações básicas para 422
    if (!name || name.length < 3)
        throw new exceptions_util_1.UnprocessableEntityException('Nome deve ter pelo menos 3 caracteres');
    if (!email || !/.+@.+\..+/.test(email))
        throw new exceptions_util_1.UnprocessableEntityException('E-mail inválido');
    if (!password || password.length < 6)
        throw new exceptions_util_1.UnprocessableEntityException('Senha deve ter pelo menos 6 caracteres');
    const exists = await user_model_1.User.findOne({ email }).select('_id');
    if (exists)
        throw new exceptions_util_1.ConflictException('E-mail já existente');
    const newUser = new user_model_1.User({ name, email, password: password });
    await newUser.save();
    logger_util_1.logger.info(`User registered in Atlas: ${email}`);
    // Se dual sync está ativo, salva também no banco local
    if (DUAL_SYNC) {
        logger_util_1.logger.info(`Dual Sync enabled, attempting to save to Local DB...`);
        const UserLocal = (0, user_model_1.getUserLocal)();
        if (!UserLocal) {
            logger_util_1.logger.error(`UserLocal model is null! Secondary connection may have failed.`);
        }
        else {
            try {
                const newUserLocal = new UserLocal({ name, email, password: password });
                await newUserLocal.save();
                logger_util_1.logger.info(`✅ User registered in Local DB: ${email}`);
            }
            catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                logger_util_1.logger.error(`❌ Failed to save user in Local DB: ${errorMsg}`);
                console.error('Full error:', error);
            }
        }
    }
    else {
        logger_util_1.logger.info(`Dual Sync is disabled (MONGODB_DUAL_SYNC=${process.env.MONGODB_DUAL_SYNC})`);
    }
    return newUser;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    if (!email || !/.+@.+\..+/.test(email))
        throw new exceptions_util_1.BadRequestException('E-mail inválido');
    if (!password)
        throw new exceptions_util_1.BadRequestException('Senha inválida');
    const user = await user_model_1.User.findOne({ email }).select('+password');
    if (!user) {
        logger_util_1.logger.warn(`Login failed: User not found for email ${email}`);
        throw new exceptions_util_1.NotFoundException('Usuário não encontrado');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        logger_util_1.logger.warn(`Login failed: Invalid password for email ${email}`);
        throw new exceptions_util_1.UnauthorizedException('Senha incorreta');
    }
    const token = (0, jsonwebtoken_1.sign)({ id: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '1h' });
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
