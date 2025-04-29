import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/users.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from '../dtos/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limite') limit: number = 5,
    @Req() request: Request & { user: any },
  ): Promise<Omit<User, 'password'>[]> {
    console.log(request.user);
    return await this.usersService.getUsers(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<User, 'password'>> {
    return await this.usersService.getUserById(id);
  }

  /*  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.usersService.createUser(user);
  } */

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: CreateUserDto,
  ) {
    return await this.usersService.updateUserById(id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUserById(id);
  }
}
