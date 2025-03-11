import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async signIn(email: string) {
    return await this.userRepo.findOne({
      where: {
        email,
      },
    });
  }
}
