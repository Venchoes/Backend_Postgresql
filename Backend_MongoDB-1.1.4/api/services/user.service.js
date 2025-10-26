"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = require("bcrypt");
const exceptions_util_1 = require("../utils/exceptions.util");
class UserService {
    async createUser(name, email, password) {
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            throw new exceptions_util_1.ConflictException('Email já está em uso.');
        }
        const newUser = new user_model_1.User({ name, email, password: password });
        await newUser.save();
        return newUser;
    }
    async verifyEmail(email) {
        const user = await user_model_1.User.findOne({ email });
        return user !== null;
    }
    async validateUser(email, password) {
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            throw new exceptions_util_1.BadRequestException('Usuário não encontrado.');
        }
        const isPasswordValid = await (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordValid) {
            throw new exceptions_util_1.BadRequestException('Senha inválida.');
        }
        return user;
    }
}
exports.UserService = UserService;
