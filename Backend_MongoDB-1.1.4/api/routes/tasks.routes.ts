import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createTaskController, listTasksController, getTaskByIdController, updateTaskPutController, updateTaskPatchController, deleteTaskController } from '../controllers/task.controller';
import { validateTaskCreate, validateTaskPut, validateTaskPatch, validateQueryFilters } from '../middlewares/validation.middleware';

const router = Router();

// Todas rotas protegidas por JWT
router.use(authMiddleware);

// POST /tasks - cria nova task
router.post('/', validateTaskCreate, createTaskController);

// GET /tasks - lista tasks do usuário, com filtros opcionais (?status=...&priority=...)
router.get('/', validateQueryFilters, listTasksController);

// GET /tasks/:id - detalhes de uma task
router.get('/:id', getTaskByIdController);

// PUT /tasks/:id - atualiza todos os dados de uma task
router.put('/:id', validateTaskPut, updateTaskPutController);

// PATCH /tasks/:id - atualiza parcialmente dados de uma task
router.patch('/:id', validateTaskPatch, updateTaskPatchController);

// DELETE /tasks/:id - remove uma task
router.delete('/:id', deleteTaskController);

export default router;
