import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from 'src/dtos/loginUse.dto';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}
  getAuth() {
    throw new NotFoundException('Method not implemented.');
  }

  async signin(credential: LoginUserDto): Promise<string> {
    const validateCredential = await this.usersRepository.signin(credential);

    if (!validateCredential) {
      throw new NotFoundException('Los datos son incorrectos');
    }

    return 'Ingreso exitoso';
  }
}
