import { Schema, model, Document, Types, Model } from 'mongoose';
import { getSecondaryConnection } from '../database/connection.database';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

export const Task = model<ITask>('Task', taskSchema);

// Função para obter o modelo local (lazy loading)
let taskLocalModel: Model<ITask> | null = null;

export const getTaskLocal = (): Model<ITask> | null => {
  if (!taskLocalModel) {
    const secondaryConn = getSecondaryConnection();
    if (secondaryConn) {
      taskLocalModel = secondaryConn.model<ITask>('Task', taskSchema);
    }
  }
  return taskLocalModel;
};
