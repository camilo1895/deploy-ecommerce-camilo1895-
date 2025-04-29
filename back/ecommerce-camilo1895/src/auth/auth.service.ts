import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { UsersRepository } from '../users/users.repository';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  getAuth() {
    throw new NotFoundException('Method not implemented.');
  }

  async signin(credential: LoginUserDto): Promise<string> {
    const validateCredential = await this.usersRepository.signin(credential);

    if (!validateCredential) {
      throw new NotFoundException('Los datos son incorrectos');
    }

    const isPassworValidate = await bcrypt.compare(
      credential.password,
      validateCredential.password,
    );

    if (!isPassworValidate) {
      throw new NotFoundException('Los datos son incorrectos');
    }

    const userPayLoad = {
      sub: validateCredential.id,
      id: validateCredential.id,
      email: validateCredential.email,
    };

    const token = this.jwtService.sign(userPayLoad);

    return `User logged in successfully ${token}`;
  }
}
