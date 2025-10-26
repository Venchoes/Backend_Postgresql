"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRouteHandler = void 0;
const protectedRouteHandler = (req, res) => {
    const user = req.user;
    console.log('[PROTECTED] Acesso autorizado para usuário:', user?.email || user?.id);
    res.status(200).json({ message: 'Acesso autorizado' });
};
exports.protectedRouteHandler = protectedRouteHandler;
