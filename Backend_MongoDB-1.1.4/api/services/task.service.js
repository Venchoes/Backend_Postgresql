"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskPatch = exports.updateTaskPut = exports.getTaskById = exports.listTasks = exports.buildFilters = exports.createTask = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const task_model_1 = require("../models/task.model");
const exceptions_util_1 = require("../utils/exceptions.util");
const logger_util_1 = require("../utils/logger.util");
const DUAL_SYNC = process.env.MONGODB_DUAL_SYNC === 'true';
const createTask = async (userId, data) => {
    if (!data.title || data.title.trim().length < 3) {
        throw new exceptions_util_1.UnprocessableEntityException('Título é obrigatório e deve ter ao menos 3 caracteres');
    }
    const payload = {
        user: userId,
        title: data.title.trim(),
        description: data.description?.trim(),
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };
    const task = await task_model_1.Task.create(payload);
    logger_util_1.logger.info(`[TASK] Task criada no Atlas para user=${userId}: ${task._id}`);
    // Dual Sync: salva também no banco local
    if (DUAL_SYNC) {
        logger_util_1.logger.info(`[TASK] Dual Sync ativo, salvando no MongoDB Local...`);
        const TaskLocal = (0, task_model_1.getTaskLocal)();
        if (!TaskLocal) {
            logger_util_1.logger.error(`[TASK] TaskLocal model is null! Secondary connection may have failed.`);
        }
        else {
            try {
                const taskLocal = new TaskLocal(payload);
                await taskLocal.save();
                logger_util_1.logger.info(`[TASK] ✅ Task salva no MongoDB Local: ${taskLocal._id}`);
            }
            catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                logger_util_1.logger.error(`[TASK] ❌ Falha ao salvar task no MongoDB Local: ${errorMsg}`);
                console.error('Full error:', error);
            }
        }
    }
    else {
        logger_util_1.logger.info(`[TASK] Dual Sync desabilitado (MONGODB_DUAL_SYNC=${process.env.MONGODB_DUAL_SYNC})`);
    }
    return task;
};
exports.createTask = createTask;
const buildFilters = (userId, query) => {
    const filter = { user: userId };
    if (query.status)
        filter.status = query.status;
    if (query.priority)
        filter.priority = query.priority;
    if (query.title)
        filter.title = { $regex: query.title, $options: 'i' };
    if (query.dueDateFrom || query.dueDateTo) {
        filter.dueDate = {};
        if (query.dueDateFrom)
            filter.dueDate.$gte = new Date(query.dueDateFrom);
        if (query.dueDateTo)
            filter.dueDate.$lte = new Date(query.dueDateTo);
    }
    return filter;
};
exports.buildFilters = buildFilters;
const listTasks = async (userId, query) => {
    const filter = (0, exports.buildFilters)(userId, query);
    const tasks = await task_model_1.Task.find(filter).sort({ createdAt: -1 });
    logger_util_1.logger.info(`[TASK] Listagem: user=${userId}, count=${tasks.length}`);
    return tasks;
};
exports.listTasks = listTasks;
const getTaskById = async (userId, taskId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(taskId))
        throw new exceptions_util_1.BadRequestException('ID inválido');
    const task = await task_model_1.Task.findById(taskId);
    if (!task)
        throw new exceptions_util_1.NotFoundException('Task não encontrada');
    if (task.user.toString() !== userId)
        throw new exceptions_util_1.ForbiddenException('Acesso negado a recurso de outro usuário');
    return task;
};
exports.getTaskById = getTaskById;
const updateTaskPut = async (userId, taskId, data) => {
    const existing = await (0, exports.getTaskById)(userId, taskId); // Faz também a checagem de ownership
    if (!data.title || data.title.trim().length < 3) {
        throw new exceptions_util_1.UnprocessableEntityException('Título é obrigatório e deve ter ao menos 3 caracteres');
    }
    existing.title = data.title.trim();
    existing.description = data.description?.trim() || '';
    if (data.status)
        existing.status = data.status;
    else
        existing.status = 'todo';
    if (data.priority)
        existing.priority = data.priority;
    else
        existing.priority = 'medium';
    existing.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    await existing.save();
    logger_util_1.logger.info(`[TASK] Task atualizada (PUT) no Atlas user=${userId} id=${taskId}`);
    // Dual Sync: atualiza também no banco local
    if (DUAL_SYNC) {
        const TaskLocal = (0, task_model_1.getTaskLocal)();
        if (TaskLocal) {
            try {
                await TaskLocal.findByIdAndUpdate(taskId, {
                    title: existing.title,
                    description: existing.description,
                    status: existing.status,
                    priority: existing.priority,
                    dueDate: existing.dueDate
                });
                logger_util_1.logger.info(`[TASK] ✅ Task atualizada (PUT) no MongoDB Local id=${taskId}`);
            }
            catch (error) {
                logger_util_1.logger.error(`[TASK] ❌ Falha ao atualizar task no MongoDB Local: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    return existing;
};
exports.updateTaskPut = updateTaskPut;
const updateTaskPatch = async (userId, taskId, data) => {
    const existing = await (0, exports.getTaskById)(userId, taskId);
    if (data.title !== undefined) {
        if (data.title.trim().length < 3)
            throw new exceptions_util_1.UnprocessableEntityException('Título deve ter ao menos 3 caracteres');
        existing.title = data.title.trim();
    }
    if (data.description !== undefined)
        existing.description = data.description?.trim();
    if (data.status !== undefined)
        existing.status = data.status;
    if (data.priority !== undefined)
        existing.priority = data.priority;
    if (data.dueDate !== undefined)
        existing.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    await existing.save();
    logger_util_1.logger.info(`[TASK] Task atualizada (PATCH) no Atlas user=${userId} id=${taskId}`);
    // Dual Sync: atualiza também no banco local
    if (DUAL_SYNC) {
        const TaskLocal = (0, task_model_1.getTaskLocal)();
        if (TaskLocal) {
            try {
                const updateFields = {};
                if (data.title !== undefined)
                    updateFields.title = existing.title;
                if (data.description !== undefined)
                    updateFields.description = existing.description;
                if (data.status !== undefined)
                    updateFields.status = existing.status;
                if (data.priority !== undefined)
                    updateFields.priority = existing.priority;
                if (data.dueDate !== undefined)
                    updateFields.dueDate = existing.dueDate;
                await TaskLocal.findByIdAndUpdate(taskId, updateFields);
                logger_util_1.logger.info(`[TASK] ✅ Task atualizada (PATCH) no MongoDB Local id=${taskId}`);
            }
            catch (error) {
                logger_util_1.logger.error(`[TASK] ❌ Falha ao atualizar task no MongoDB Local: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    return existing;
};
exports.updateTaskPatch = updateTaskPatch;
const deleteTask = async (userId, taskId) => {
    const existing = await (0, exports.getTaskById)(userId, taskId);
    await existing.deleteOne();
    logger_util_1.logger.info(`[TASK] Task removida do Atlas user=${userId} id=${taskId}`);
    // Dual Sync: remove também do banco local
    if (DUAL_SYNC) {
        const TaskLocal = (0, task_model_1.getTaskLocal)();
        if (TaskLocal) {
            try {
                await TaskLocal.findByIdAndDelete(taskId);
                logger_util_1.logger.info(`[TASK] ✅ Task removida do MongoDB Local id=${taskId}`);
            }
            catch (error) {
                logger_util_1.logger.error(`[TASK] ❌ Falha ao remover task do MongoDB Local: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
};
exports.deleteTask = deleteTask;
