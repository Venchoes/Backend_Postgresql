"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const task_controller_1 = require("../controllers/task.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
// Todas rotas protegidas por JWT
router.use(auth_middleware_1.authMiddleware);
// POST /tasks - cria nova task
router.post('/', validation_middleware_1.validateTaskCreate, task_controller_1.createTaskController);
// GET /tasks - lista tasks do usuário, com filtros opcionais (?status=...&priority=...)
router.get('/', validation_middleware_1.validateQueryFilters, task_controller_1.listTasksController);
// GET /tasks/:id - detalhes de uma task
router.get('/:id', task_controller_1.getTaskByIdController);
// PUT /tasks/:id - atualiza todos os dados de uma task
router.put('/:id', validation_middleware_1.validateTaskPut, task_controller_1.updateTaskPutController);
// PATCH /tasks/:id - atualiza parcialmente dados de uma task
router.patch('/:id', validation_middleware_1.validateTaskPatch, task_controller_1.updateTaskPatchController);
// DELETE /tasks/:id - remove uma task
router.delete('/:id', task_controller_1.deleteTaskController);
exports.default = router;
