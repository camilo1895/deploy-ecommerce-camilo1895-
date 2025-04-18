import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/users.entity';
import { UserDto } from 'src/dtos/users.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limite') limit: number = 5,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersService.getUsers(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUserById(
    @Param('id') id: string,
  ): Promise<Omit<User, 'password'> | string> {
    return this.usersService.getUserById(Number(id));
  }

  @Post()
  createUser(@Body() user: UserDto) {
    return this.usersService.createUser(user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateUserById(@Param('id') id: string, @Body() user: UserDto) {
    return this.usersService.updateUserById(Number(id), user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(Number(id));
  }
}
