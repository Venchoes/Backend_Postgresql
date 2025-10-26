import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { NotFoundException, ForbiddenException, UnprocessableEntityException, BadRequestException } from '../utils/exceptions.util';
import { logger } from '../utils/logger.util';
import { getDataSource } from '../database/connection.database';

type QueryFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  title?: string; // substring match
  dueDateFrom?: string; // ISO date
  dueDateTo?: string; // ISO date
};

export const createTask = async (userId: string, data: Partial<Task>): Promise<Task> => {
  if (!data.title || data.title.trim().length < 3) {
    throw new UnprocessableEntityException('Título é obrigatório e deve ter ao menos 3 caracteres');
  }

  const ds = getDataSource();
  const repo = ds.getRepository(Task);

  const payload = repo.create({
    user: { id: Number(userId) } as any,
    title: data.title.trim(),
    description: data.description?.trim(),
    status: (data.status as TaskStatus) || 'todo',
    priority: (data.priority as TaskPriority) || 'medium',
    dueDate: data.dueDate ? new Date(data.dueDate as any) : null,
  });

  const task = await repo.save(payload);
  logger.info(`[TASK] Task criada no PostgreSQL para user=${userId}: ${task.id}`);
  return task;
};

export const listTasks = async (userId: string, query: QueryFilters): Promise<Task[]> => {
  const ds = getDataSource();
  const repo = ds.getRepository(Task);

  const where: any = { user: { id: Number(userId) } };
  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;

  const qb = repo.createQueryBuilder('task').where('task.userId = :userId', { userId: Number(userId) });
  if (query.status) qb.andWhere('task.status = :status', { status: query.status });
  if (query.priority) qb.andWhere('task.priority = :priority', { priority: query.priority });
  if (query.title) qb.andWhere('task.title ILIKE :title', { title: `%${query.title}%` });
  if (query.dueDateFrom) qb.andWhere('task."dueDate" >= :from', { from: new Date(query.dueDateFrom) });
  if (query.dueDateTo) qb.andWhere('task."dueDate" <= :to', { to: new Date(query.dueDateTo) });

  const tasks = await qb.orderBy('task.createdAt', 'DESC').getMany();
  logger.info(`[TASK] Listagem: user=${userId}, count=${tasks.length}`);
  return tasks;
};

export const getTaskById = async (userId: string, taskId: string): Promise<Task> => {
  const idNum = Number(taskId);
  if (!Number.isInteger(idNum) || idNum <= 0) throw new BadRequestException('ID inválido');

  const ds = getDataSource();
  const repo = ds.getRepository(Task);
  const task = await repo.findOne({ where: { id: idNum }, relations: ['user'] });
  if (!task) throw new NotFoundException('Task não encontrada');
  if (String((task.user as any).id) !== String(userId)) throw new ForbiddenException('Acesso negado a recurso de outro usuário');
  return task;
};

export const updateTaskPut = async (userId: string, taskId: string, data: Partial<Task>): Promise<Task> => {
  const existing = await getTaskById(userId, taskId);

  if (!data.title || data.title.trim().length < 3) {
    throw new UnprocessableEntityException('Título é obrigatório e deve ter ao menos 3 caracteres');
  }

  existing.title = data.title.trim();
  existing.description = data.description?.trim() || '';
  existing.status = (data.status as TaskStatus) || 'todo';
  existing.priority = (data.priority as TaskPriority) || 'medium';
  existing.dueDate = data.dueDate ? new Date(data.dueDate as any) : null;

  const ds = getDataSource();
  const repo = ds.getRepository(Task);
  const saved = await repo.save(existing);
  logger.info(`[TASK] Task atualizada (PUT) no PostgreSQL user=${userId} id=${taskId}`);
  return saved;
};

export const updateTaskPatch = async (userId: string, taskId: string, data: Partial<Task>): Promise<Task> => {
  const existing = await getTaskById(userId, taskId);

  if (data.title !== undefined) {
    if (data.title.trim().length < 3) throw new UnprocessableEntityException('Título deve ter ao menos 3 caracteres');
    existing.title = data.title.trim();
  }
  if (data.description !== undefined) existing.description = data.description?.trim() || null;
  if (data.status !== undefined) existing.status = data.status as TaskStatus;
  if (data.priority !== undefined) existing.priority = data.priority as TaskPriority;
  if (data.dueDate !== undefined) existing.dueDate = data.dueDate ? new Date(data.dueDate as any) : null;

  const ds = getDataSource();
  const repo = ds.getRepository(Task);
  const saved = await repo.save(existing);
  logger.info(`[TASK] Task atualizada (PATCH) no PostgreSQL user=${userId} id=${taskId}`);
  return saved;
};

export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const existing = await getTaskById(userId, taskId);
  const ds = getDataSource();
  const repo = ds.getRepository(Task);
  await repo.delete(existing.id);
  logger.info(`[TASK] Task removida do PostgreSQL user=${userId} id=${taskId}`);
};
