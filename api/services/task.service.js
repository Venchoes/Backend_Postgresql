"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskPatch = exports.updateTaskPut = exports.getTaskById = exports.listTasks = exports.createTask = void 0;
const task_model_1 = require("../models/task.model");
const exceptions_util_1 = require("../utils/exceptions.util");
const logger_util_1 = require("../utils/logger.util");
const connection_database_1 = require("../database/connection.database");
const createTask = async (userId, data) => {
    if (!data.title || data.title.trim().length < 3) {
        throw new exceptions_util_1.UnprocessableEntityException('Título é obrigatório e deve ter ao menos 3 caracteres');
    }
    const ds = (0, connection_database_1.getDataSource)();
    const repo = ds.getRepository(task_model_1.Task);
    const payload = repo.create({
        user: { id: Number(userId) },
        title: data.title.trim(),
        description: data.description?.trim(),
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });
    const task = await repo.save(payload);
    logger_util_1.logger.info(`[TASK] Task criada no PostgreSQL para user=${userId}: ${task.id}`);
    return task;
};
exports.createTask = createTask;
const listTasks = async (userId, query) => {
    const ds = (0, connection_database_1.getDataSource)();
    const repo = ds.getRepository(task_model_1.Task);
    const where = { user: { id: Number(userId) } };
    if (query.status)
        where.status = query.status;
    if (query.priority)
        where.priority = query.priority;
    const qb = repo.createQueryBuilder('task').where('task.userId = :userId', { userId: Number(userId) });
    if (query.status)
        qb.andWhere('task.status = :status', { status: query.status });
    if (query.priority)
        qb.andWhere('task.priority = :priority', { priority: query.priority });
    if (query.title)
        qb.andWhere('task.title ILIKE :title', { title: `%${query.title}%` });
    if (query.dueDateFrom)
        qb.andWhere('task."dueDate" >= :from', { from: new Date(query.dueDateFrom) });
    if (query.dueDateTo)
        qb.andWhere('task."dueDate" <= :to', { to: new Date(query.dueDateTo) });
    const tasks = await qb.orderBy('task.createdAt', 'DESC').getMany();
    logger_util_1.logger.info(`[TASK] Listagem: user=${userId}, count=${tasks.length}`);
    return tasks;
};
exports.listTasks = listTasks;
const getTaskById = async (userId, taskId) => {
    const idNum = Number(taskId);
    if (!Number.isInteger(idNum) || idNum <= 0)
        throw new exceptions_util_1.BadRequestException('ID inválido');
    const ds = (0, connection_database_1.getDataSource)();
    const repo = ds.getRepository(task_model_1.Task);
    const task = await repo.findOne({ where: { id: idNum }, relations: ['user'] });
    if (!task)
        throw new exceptions_util_1.NotFoundException('Task não encontrada');
    if (String(task.user.id) !== String(userId))
        throw new exceptions_util_1.ForbiddenException('Acesso negado a recurso de outro usuário');
    return task;
};
exports.getTaskById = getTaskById;
const updateTaskPut = async (userId, taskId, data) => {
    const existing = await (0, exports.getTaskById)(userId, taskId);
    if (!data.title || data.title.trim().length < 3) {
        throw new exceptions_util_1.UnprocessableEntityException('Título é obrigatório e deve ter ao menos 3 caracteres');
    }
    existing.title = data.title.trim();
    existing.description = data.description?.trim() || '';
    existing.status = data.status || 'todo';
    existing.priority = data.priority || 'medium';
    existing.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    const ds = (0, connection_database_1.getDataSource)();
    const repo = ds.getRepository(task_model_1.Task);
    const saved = await repo.save(existing);
    logger_util_1.logger.info(`[TASK] Task atualizada (PUT) no PostgreSQL user=${userId} id=${taskId}`);
    return saved;
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
        existing.description = data.description?.trim() || null;
    if (data.status !== undefined)
        existing.status = data.status;
    if (data.priority !== undefined)
        existing.priority = data.priority;
    if (data.dueDate !== undefined)
        existing.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    const ds = (0, connection_database_1.getDataSource)();
    const repo = ds.getRepository(task_model_1.Task);
    const saved = await repo.save(existing);
    logger_util_1.logger.info(`[TASK] Task atualizada (PATCH) no PostgreSQL user=${userId} id=${taskId}`);
    return saved;
};
exports.updateTaskPatch = updateTaskPatch;
const deleteTask = async (userId, taskId) => {
    const existing = await (0, exports.getTaskById)(userId, taskId);
    const ds = (0, connection_database_1.getDataSource)();
    const repo = ds.getRepository(task_model_1.Task);
    await repo.delete(existing.id);
    logger_util_1.logger.info(`[TASK] Task removida do PostgreSQL user=${userId} id=${taskId}`);
};
exports.deleteTask = deleteTask;
