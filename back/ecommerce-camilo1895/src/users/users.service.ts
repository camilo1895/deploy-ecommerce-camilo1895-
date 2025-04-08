import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from 'src/entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  getUserById() {
    return this.usersRepository.getUserById();
  }

  createUser() {
    return this.usersRepository.createUser();
  }

  updateUserById() {
    return this.usersRepository.updateUserById();
  }

  deleteUserById() {
    return this.usersRepository.deleteUserById();
  }
}
