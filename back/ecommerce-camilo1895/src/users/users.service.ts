import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersRepository.getUsers(page, limit);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('Usuario no existe');
    }
    const { password, ...rest } = user;

    return rest;
  }

  async signup(user: CreateUserDto): Promise<User> {
    if (user.password !== user.validatePassword) {
      throw new NotFoundException('Password no coincide');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) {
      throw new NotFoundException('Password could not be hashed');
    }

    user.password = hashedPassword;

    const saveUser = await this.usersRepository.signup(user);

    if (!saveUser) {
      throw new NotFoundException('Usuario no se creo correctamente');
    }

    return saveUser;
  }

  async updateUserById(id: string, user: CreateUserDto) {
    const validateUser = await this.usersRepository.getUserById(id);

    if (!validateUser) {
      throw new NotFoundException('Usuario no existe');
    }

    return await this.usersRepository.updateUserById(id, user);
  }

  async deleteUserById(id: string) {
    const validateUser = await this.usersRepository.getUserById(id);

    if (!validateUser) {
      throw new NotFoundException('Usuario no existe');
    }

    return await this.usersRepository.deleteUserById(id);
  }
}
