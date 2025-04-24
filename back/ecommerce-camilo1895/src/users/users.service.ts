import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from 'src/entities/users.entity';
import { CreateUserDto } from 'src/dtos/createUser.dto';

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

  async createUser(user: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(user);
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
