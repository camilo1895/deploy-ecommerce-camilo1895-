import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from 'src/entities/users.entity';
import { UserDto } from 'src/dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersRepository.getUsers(page, limit);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | string> {
    const user = await this.usersRepository.getUserById(id);

    if (!user) {
      return 'Usuario no existe';
    }
    const { password, ...rest } = user;

    return rest;
  }

  async createUser(user: UserDto): Promise<User> {
    return this.usersRepository.createUser(user);
  }

  async updateUserById(id: string, user: UserDto) {
    const validateUser = await this.usersRepository.getUserById(id);

    if (!validateUser) {
      return 'Usuario no existe';
    }

    return await this.usersRepository.updateUserById(id, user);
  }

  async deleteUserById(id: string) {
    const validateUser = await this.usersRepository.getUserById(id);

    if (!validateUser) {
      return 'Usuario no existe';
    }

    return await this.usersRepository.deleteUserById(id);
  }
}
