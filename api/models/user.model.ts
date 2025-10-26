import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import bcrypt from 'bcrypt';
import { Task } from './task.model';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @OneToMany(() => Task, (task: any) => task.user)
  tasks!: Task[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Evita re-hash se já estiver no formato bcrypt
    if (this.password && !this.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
