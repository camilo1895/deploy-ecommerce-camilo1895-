import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../users/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(credential: LoginUserDto) {
    const dbUser = await this.authRepository.signIn(credential.email);
    if (!dbUser) {
      throw new NotFoundException('Email o password incorrectos');
    }

    const isPasswordValidate = await bcrypt.compare(
      credential.password,
      dbUser.password,
    );

    if (!isPasswordValidate) {
      throw new NotFoundException('Email o password incorrectos');
    }

    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      roles: [dbUser.isAdmin ? Role.Admin : Role.User],
    };

    // Genera un JWT con los datos de `userPayload`, firmado con la clave secreta.
    const token = this.jwtService.sign(userPayload);

    return { sucess: 'User logged in sucessfully', token };
  }
}
