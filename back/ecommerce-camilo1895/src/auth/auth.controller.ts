import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getAuth() {
    return this.authService.getAuth();
  }

  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    return await this.usersService.signup(user);
  }

  @Post('signin')
  async signin(@Body() credential: LoginUserDto) {
    return await this.authService.signin(credential);
  }
}
