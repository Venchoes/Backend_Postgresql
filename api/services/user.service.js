"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = require("bcrypt");
const exceptions_util_1 = require("../utils/exceptions.util");
const connection_database_1 = require("../database/connection.database");
class UserService {
    async createUser(name, email, password) {
        const ds = (0, connection_database_1.getDataSource)();
        const repo = ds.getRepository(user_model_1.User);
        const existingUser = await repo.findOne({ where: { email }, select: ['id'] });
        if (existingUser)
            throw new exceptions_util_1.ConflictException('Email já está em uso.');
        const newUser = repo.create({ name, email, password });
        await repo.save(newUser);
        return newUser;
    }
    async verifyEmail(email) {
        const ds = (0, connection_database_1.getDataSource)();
        const repo = ds.getRepository(user_model_1.User);
        const user = await repo.findOne({ where: { email }, select: ['id'] });
        return !!user;
    }
    async validateUser(email, password) {
        const ds = (0, connection_database_1.getDataSource)();
        const repo = ds.getRepository(user_model_1.User);
        const user = await repo.findOne({ where: { email } });
        if (!user)
            throw new exceptions_util_1.BadRequestException('Usuário não encontrado.');
        const isPasswordValid = await (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordValid)
            throw new exceptions_util_1.BadRequestException('Senha inválida.');
        return user;
    }
}
exports.UserService = UserService;
