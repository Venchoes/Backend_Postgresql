"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskLocal = exports.Task = void 0;
const mongoose_1 = require("mongoose");
const connection_database_1 = require("../database/connection.database");
const taskSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000 },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo',
        index: true,
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
    dueDate: { type: Date, required: false, default: null },
}, { timestamps: true });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
// Função para obter o modelo local (lazy loading)
let taskLocalModel = null;
const getTaskLocal = () => {
    if (!taskLocalModel) {
        const secondaryConn = (0, connection_database_1.getSecondaryConnection)();
        if (secondaryConn) {
            taskLocalModel = secondaryConn.model('Task', taskSchema);
        }
    }
    return taskLocalModel;
};
exports.getTaskLocal = getTaskLocal;
