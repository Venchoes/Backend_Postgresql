"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskController = exports.updateTaskPatchController = exports.updateTaskPutController = exports.getTaskByIdController = exports.listTasksController = exports.createTaskController = void 0;
const task_service_1 = require("../services/task.service");
const createTaskController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const task = await (0, task_service_1.createTask)(userId, req.body);
        return res.status(201).json(task);
    }
    catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || 'Erro ao criar task' });
    }
};
exports.createTaskController = createTaskController;
const listTasksController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const tasks = await (0, task_service_1.listTasks)(userId, req.query);
        return res.status(200).json(tasks);
    }
    catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || 'Erro ao listar tasks' });
    }
};
exports.listTasksController = listTasksController;
const getTaskByIdController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const task = await (0, task_service_1.getTaskById)(userId, id);
        return res.status(200).json(task);
    }
    catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || 'Erro ao buscar task' });
    }
};
exports.getTaskByIdController = getTaskByIdController;
const updateTaskPutController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const task = await (0, task_service_1.updateTaskPut)(userId, id, req.body);
        return res.status(200).json(task);
    }
    catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || 'Erro ao atualizar task' });
    }
};
exports.updateTaskPutController = updateTaskPutController;
const updateTaskPatchController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const task = await (0, task_service_1.updateTaskPatch)(userId, id, req.body);
        return res.status(200).json(task);
    }
    catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || 'Erro ao atualizar task' });
    }
};
exports.updateTaskPatchController = updateTaskPatchController;
const deleteTaskController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        await (0, task_service_1.deleteTask)(userId, id);
        return res.status(204).send();
    }
    catch (error) {
        const status = error.status || 500;
        return res.status(status).json({ error: error.message || 'Erro ao excluir task' });
    }
};
exports.deleteTaskController = deleteTaskController;
