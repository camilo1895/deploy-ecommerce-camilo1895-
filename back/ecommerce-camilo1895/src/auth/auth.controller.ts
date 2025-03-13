import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { ValidationPasswordPipe } from '../pipes/validation-password.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signin')
  async signIn(
    @Body() credential: LoginUserDto,
    @Req() request: Request & { user: any },
  ) {
    return await this.authService.signIn(credential);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body(new ValidationPasswordPipe()) user: CreateUserDto,
  ): Promise<string | Omit<CreateUserDto, 'password' | 'confirmarPassword'>> {
    const {
      email,
      name,
      password,
      confirmarPassword,
      address,
      phone,
      country,
      city,
    } = user;

    return await this.usersService.signup({
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
}
