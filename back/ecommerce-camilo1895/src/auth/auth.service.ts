import { Injectable } from '@nestjs/common';
import { CredentialDto } from 'src/dtos/signin.dto';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}
  getAuth() {
    throw new Error('Method not implemented.');
  }

  signin(credential: CredentialDto) {
    return this.usersRepository.signin(credential);
  }
}
