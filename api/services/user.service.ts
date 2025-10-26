import { User } from '../models/user.model';
import { hash, compare } from 'bcrypt';
import { ConflictException, BadRequestException } from '../utils/exceptions.util';

export class UserService {
    async createUser(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Email já está em uso.');
        }

        const newUser = new User({ name, email, password: password });
        await newUser.save();
        return newUser;
    }

    async verifyEmail(email: string) {
    const user = await User.findOne({ email });
        return user !== null;
    }

    async validateUser(email: string, password: string) {
    const user = await User.findOne({ email });
        if (!user) {
            throw new BadRequestException('Usuário não encontrado.');
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Senha inválida.');
        }

        return user;
    }
}