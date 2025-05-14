import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from 'src/entities/users.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({
    summary: 'Registra un nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en el sistema',
  })
  @Post('signup')
  async signup(@Body() user: CreateUserDto): Promise<User> {
    return await this.usersService.signup(user);
  }

  @ApiOperation({
    summary: 'Inicio de sesión de usuario',
    description:
      'Autentica a un usuario y devuelve un token JWT para acceder a los recursos protegidos',
  })
  @Post('signin')
  async signin(@Body() credential: LoginUserDto) {
    return await this.authService.signin(credential);
  }
}
