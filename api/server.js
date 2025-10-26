"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const connection_database_1 = __importDefault(require("./database/connection.database"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const protected_routes_1 = __importDefault(require("./routes/protected.routes"));
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const errorHandler_middleware_1 = __importDefault(require("./middlewares/errorHandler.middleware"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
console.log('[SERVER] Iniciando servidor...');
console.log('[SERVER] Ambiente:', process.env.NODE_ENV || 'development');
// Connect to the database
(0, connection_database_1.default)();
// Configure the Express application
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({
        message: '🚀 Projeto Backend com Express e PostgreSQL funcionando corretamente :)!',
        status: 'WORKING',
    });
});
// Rotas (MVP requer /register, /login e /protected)
app.use('/', auth_routes_1.default); // POST /register, POST /login
app.use('/protected', protected_routes_1.default); // GET /protected
app.use('/tasks', tasks_routes_1.default); // CRUD de tarefas (protegido)
// Middleware de erro
app.use(errorHandler_middleware_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`[SERVER] ✅ Servidor rodando em http://localhost:${PORT}`);
    console.log('[SERVER] Endpoints disponíveis:');
    console.log('[SERVER]   POST /register');
    console.log('[SERVER]   POST /login');
    console.log('[SERVER]   GET /protected');
    console.log('[SERVER]   CRUD /tasks');
});
