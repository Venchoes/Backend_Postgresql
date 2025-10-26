import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { getSecondaryConnection } from '../database/connection.database';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);

// Função para obter o modelo local (lazy loading)
let userLocalModel: Model<IUser> | null = null;

export const getUserLocal = (): Model<IUser> | null => {
  if (!userLocalModel) {
    const secondaryConn = getSecondaryConnection();
    if (secondaryConn) {
      userLocalModel = secondaryConn.model<IUser>('User', userSchema);
    }
  }
  return userLocalModel;
};
