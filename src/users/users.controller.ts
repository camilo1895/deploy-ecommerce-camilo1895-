import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/users.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from '../dtos/createUser.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from './roles.enum';
import { RolesGuard } from './roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  //@Roles(Role.User)
  // @UseGuards(AuthGuard, RolesGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<Omit<User, 'password'>[]> {
    return await this.usersService.getUsers(Number(page), Number(limit));
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.getUserById(id);
  }

  /* @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<string> {
    const { email, name, password, address, phone, country, city } = user;

    return await this.usersService.createUser({
      email,
      name,
      password,
      address,
      phone,
      country,
      city,
    });
  }*/

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userUpdate: CreateUserDto,
  ): Promise<User> {
    const {
      email,
      name,
      password,
      confirmarPassword,
      address,
      phone,
      country,
      city,
    } = userUpdate;

    return await this.usersService.updateUser(id, {
      email,
      name,
      password,
      confirmarPassword,
      address,
      phone,
      country,
      city,
    });
  }

  @Delete(':id')
  @Roles(Role.Admin) // 🔹 Primero los permisos
  @UseGuards(AuthGuard, RolesGuard) // 🔹 Luego los guards
  async deleteUser(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<User[] | string> {
    return await this.usersService.deleteUser(userId);
  }
}
