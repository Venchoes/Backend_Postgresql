import { Request, Response } from 'express';
import { createTask, listTasks, getTaskById, updateTaskPut, updateTaskPatch, deleteTask } from '../services/task.service';

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string;
    const task = await createTask(userId, req.body);
    return res.status(201).json(task);
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Erro ao criar task' });
  }
};

export const listTasksController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string;
    const tasks = await listTasks(userId, req.query as any);
    return res.status(200).json(tasks);
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Erro ao listar tasks' });
  }
};

export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string;
    const { id } = req.params;
    const task = await getTaskById(userId, id);
    return res.status(200).json(task);
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Erro ao buscar task' });
  }
};

export const updateTaskPutController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string;
    const { id } = req.params;
    const task = await updateTaskPut(userId, id, req.body);
    return res.status(200).json(task);
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Erro ao atualizar task' });
  }
};

export const updateTaskPatchController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string;
    const { id } = req.params;
    const task = await updateTaskPatch(userId, id, req.body);
    return res.status(200).json(task);
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Erro ao atualizar task' });
  }
};

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string;
    const { id } = req.params;
    await deleteTask(userId, id);
    return res.status(204).send();
  } catch (error: any) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Erro ao excluir task' });
  }
};
