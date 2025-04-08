import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUserById() {
    return this.usersService.getUserById();
  }

  @Post()
  createUser() {
    return this.usersService.createUser();
  }

  @Put(':id')
  updateUserById() {
    return this.usersService.updateUserById();
  }

  @Delete(':id')
  deleteUserById() {
    return this.usersService.deleteUserById();
  }
}
