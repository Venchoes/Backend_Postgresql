import mongoose, { FilterQuery, Types } from 'mongoose';
import { Task, ITask, TaskPriority, TaskStatus, getTaskLocal } from '../models/task.model';
import { NotFoundException, ForbiddenException, UnprocessableEntityException, BadRequestException } from '../utils/exceptions.util';
import { logger } from '../utils/logger.util';

const DUAL_SYNC = process.env.MONGODB_DUAL_SYNC === 'true';

type QueryFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  title?: string; // substring match
  dueDateFrom?: string; // ISO date
  dueDateTo?: string; // ISO date
};

export const createTask = async (userId: string, data: Partial<ITask>): Promise<ITask> => {
  if (!data.title || data.title.trim().length < 3) {
    throw new UnprocessableEntityException('Título é obrigatório e deve ter ao menos 3 caracteres');
  }
  const payload: Partial<ITask> = {
    user: (userId as any),
    title: data.title.trim(),
    description: data.description?.trim(),
    status: (data.status as TaskStatus) || 'todo',
    priority: (data.priority as TaskPriority) || 'medium',
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  };
  const task = await Task.create(payload);
  logger.info(`[TASK] Task criada no Atlas para user=${userId}: ${task._id}`);
  
  // Dual Sync: salva também no banco local
  if (DUAL_SYNC) {
    logger.info(`[TASK] Dual Sync ativo, salvando no MongoDB Local...`);
    const TaskLocal = getTaskLocal();
    if (!TaskLocal) {
      logger.error(`[TASK] TaskLocal model is null! Secondary connection may have failed.`);
    } else {
      try {
        const taskLocal = new TaskLocal(payload);
        await taskLocal.save();
        logger.info(`[TASK] ✅ Task salva no MongoDB Local: ${taskLocal._id}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`[TASK] ❌ Falha ao salvar task no MongoDB Local: ${errorMsg}`);
        console.error('Full error:', error);
      }
    }
  } else {
    logger.info(`[TASK] Dual Sync desabilitado (MONGODB_DUAL_SYNC=${process.env.MONGODB_DUAL_SYNC})`);
  }
  
  return task;
};

export const buildFilters = (userId: string, query: QueryFilters): FilterQuery<ITask> => {
  const filter: FilterQuery<ITask> = { user: (userId as any) };
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.title) filter.title = { $regex: query.title, $options: 'i' } as any;
  if (query.dueDateFrom || query.dueDateTo) {
    filter.dueDate = {} as any;
    if (query.dueDateFrom) (filter.dueDate as any).$gte = new Date(query.dueDateFrom);
    if (query.dueDateTo) (filter.dueDate as any).$lte = new Date(query.dueDateTo);
  }
  return filter;
};

export const listTasks = async (userId: string, query: QueryFilters): Promise<ITask[]> => {
  const filter = buildFilters(userId, query);
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  logger.info(`[TASK] Listagem: user=${userId}, count=${tasks.length}`);
  return tasks;
};

export const getTaskById = async (userId: string, taskId: string): Promise<ITask> => {
  if (!(mongoose as any).Types.ObjectId.isValid(taskId)) throw new BadRequestException('ID inválido');
  const task = await Task.findById(taskId);
  if (!task) throw new NotFoundException('Task não encontrada');
  if (task.user.toString() !== userId) throw new ForbiddenException('Acesso negado a recurso de outro usuário');
  return task;
};

export const updateTaskPut = async (userId: string, taskId: string, data: Partial<ITask>): Promise<ITask> => {
  const existing = await getTaskById(userId, taskId); // Faz também a checagem de ownership

  if (!data.title || data.title.trim().length < 3) {
    throw new UnprocessableEntityException('Título é obrigatório e deve ter ao menos 3 caracteres');
  }

  existing.title = data.title.trim();
  existing.description = data.description?.trim() || '';
  if (data.status) existing.status = data.status as TaskStatus; else existing.status = 'todo';
  if (data.priority) existing.priority = data.priority as TaskPriority; else existing.priority = 'medium';
  existing.dueDate = data.dueDate ? new Date(data.dueDate) : null;

  await existing.save();
  logger.info(`[TASK] Task atualizada (PUT) no Atlas user=${userId} id=${taskId}`);
  
  // Dual Sync: atualiza também no banco local
  if (DUAL_SYNC) {
    const TaskLocal = getTaskLocal();
    if (TaskLocal) {
      try {
        await TaskLocal.findByIdAndUpdate(taskId, {
          title: existing.title,
          description: existing.description,
          status: existing.status,
          priority: existing.priority,
          dueDate: existing.dueDate
        });
        logger.info(`[TASK] ✅ Task atualizada (PUT) no MongoDB Local id=${taskId}`);
      } catch (error) {
        logger.error(`[TASK] ❌ Falha ao atualizar task no MongoDB Local: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  
  return existing;
};

export const updateTaskPatch = async (userId: string, taskId: string, data: Partial<ITask>): Promise<ITask> => {
  const existing = await getTaskById(userId, taskId);

  if (data.title !== undefined) {
    if (data.title.trim().length < 3) throw new UnprocessableEntityException('Título deve ter ao menos 3 caracteres');
    existing.title = data.title.trim();
  }
  if (data.description !== undefined) existing.description = data.description?.trim();
  if (data.status !== undefined) existing.status = data.status as TaskStatus;
  if (data.priority !== undefined) existing.priority = data.priority as TaskPriority;
  if (data.dueDate !== undefined) existing.dueDate = data.dueDate ? new Date(data.dueDate) : null;

  await existing.save();
  logger.info(`[TASK] Task atualizada (PATCH) no Atlas user=${userId} id=${taskId}`);
  
  // Dual Sync: atualiza também no banco local
  if (DUAL_SYNC) {
    const TaskLocal = getTaskLocal();
    if (TaskLocal) {
      try {
        const updateFields: any = {};
        if (data.title !== undefined) updateFields.title = existing.title;
        if (data.description !== undefined) updateFields.description = existing.description;
        if (data.status !== undefined) updateFields.status = existing.status;
        if (data.priority !== undefined) updateFields.priority = existing.priority;
        if (data.dueDate !== undefined) updateFields.dueDate = existing.dueDate;
        
        await TaskLocal.findByIdAndUpdate(taskId, updateFields);
        logger.info(`[TASK] ✅ Task atualizada (PATCH) no MongoDB Local id=${taskId}`);
      } catch (error) {
        logger.error(`[TASK] ❌ Falha ao atualizar task no MongoDB Local: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  
  return existing;
};

export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const existing = await getTaskById(userId, taskId);
  await existing.deleteOne();
  logger.info(`[TASK] Task removida do Atlas user=${userId} id=${taskId}`);
  
  // Dual Sync: remove também do banco local
  if (DUAL_SYNC) {
    const TaskLocal = getTaskLocal();
    if (TaskLocal) {
      try {
        await TaskLocal.findByIdAndDelete(taskId);
        logger.info(`[TASK] ✅ Task removida do MongoDB Local id=${taskId}`);
      } catch (error) {
        logger.error(`[TASK] ❌ Falha ao remover task do MongoDB Local: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
};
