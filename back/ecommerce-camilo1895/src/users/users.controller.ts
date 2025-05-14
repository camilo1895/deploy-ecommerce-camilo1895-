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
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('Users')
  @ApiOperation({
    summary: 'Consulta todos los usuarios',
    description:
      'Obtiene una lista paginada de todos los usuarios existentes. Solo disponible para administradores.',
  })
  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limite') limit: number = 5,
    @Req() request: Request & { user: any },
  ): Promise<User[]> {
    console.log(request.user);
    return await this.usersService.getUsers(page, limit);
  }

  @ApiOperation({
    summary: 'Obtiene un usuario por ID',
    description:
      'Devuelve los detalles de un usuario específico basado en su ID UUID',
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.getUserById(id);
  }

  @ApiOperation({
    summary: 'Actualiza un usuario por ID',
    description:
      'Permite actualizar la información de un usuario existente identificado por su UUID',
  })
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUserById(id, user);
  }

  @ApiOperation({
    summary: 'Elimina un usuario por ID',
    description:
      'Elimina permanentemente un usuario específico del sistema basado en su ID UUID',
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUserById(id);
  }
}
