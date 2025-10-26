"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await (0, auth_service_1.registerUser)(name, email, password);
        return res.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (error) {
        const status = error.status || 500;
        if (status >= 500) {
            console.error('[REGISTER ERROR]', error);
        }
        return res.status(status).json({ error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await (0, auth_service_1.loginUser)(email, password);
        return res.status(200).json({ token });
    }
    catch (error) {
        const status = error.status || 500;
        if (status >= 500) {
            console.error('[LOGIN ERROR]', error);
        }
        return res.status(status).json({ error: error.message });
    }
};
exports.login = login;
