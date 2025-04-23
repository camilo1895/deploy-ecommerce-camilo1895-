import { Injectable } from '@nestjs/common';
import { CredentialDto } from 'src/dtos/signin.dto';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}
  getAuth() {
    throw new Error('Method not implemented.');
  }

  async signin(credential: CredentialDto): Promise<string> {
    const validateCredential = await this.usersRepository.signin(credential);

    if (!validateCredential) {
      return 'Los datos son incorrectos';
    }

    return 'Ingreso exitoso';
  }
}
