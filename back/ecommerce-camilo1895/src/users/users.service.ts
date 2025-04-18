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

  async getUserById(id: number): Promise<Omit<User, 'password'> | string> {
    return this.usersRepository.getUserById(id);
  }

  createUser(user: UserDto) {
    return this.usersRepository.createUser(user);
  }

  updateUserById(id: number, user: UserDto) {
    const index = this.usersRepository.updateUserById(id);

    if (index === -1) {
      return 'Usuario no existe';
    }

    return (this.usersRepository.users[index] = {
      ...this.usersRepository.users[index],
      ...user,
    });
  }

  deleteUserById(id: number) {
    const index = this.usersRepository.deleteUserById(id);

    if (index === -1) {
      return 'Usuario no existe';
    }

    return this.usersRepository.users.splice(index, 1);
  }
}
