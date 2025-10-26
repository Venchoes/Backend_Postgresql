import { User } from '../models/user.model';
import { compare } from 'bcrypt';
import { ConflictException, BadRequestException } from '../utils/exceptions.util';
import { getDataSource } from '../database/connection.database';

export class UserService {
    async createUser(name: string, email: string, password: string) {
        const ds = getDataSource();
        const repo = ds.getRepository(User);
        const existingUser = await repo.findOne({ where: { email }, select: ['id'] });
        if (existingUser) throw new ConflictException('Email já está em uso.');
        const newUser = repo.create({ name, email, password });
        await repo.save(newUser);
        return newUser;
    }

    async verifyEmail(email: string) {
        const ds = getDataSource();
        const repo = ds.getRepository(User);
        const user = await repo.findOne({ where: { email }, select: ['id'] });
        return !!user;
    }

    async validateUser(email: string, password: string) {
        const ds = getDataSource();
        const repo = ds.getRepository(User);
        const user = await repo.findOne({ where: { email } });
        if (!user) throw new BadRequestException('Usuário não encontrado.');
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Senha inválida.');
        return user;
    }
}