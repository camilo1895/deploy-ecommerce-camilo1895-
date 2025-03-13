import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(page: number, limit: number): Promise<User[]> {
    return await this.userRepo.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
      relations: ['orders'],
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        phone: true,
        country: true,
        city: true,
        orders: {
          // Relación con la tabla Order
          id: true,
          date: true,
        },
      },
    });
  }

  async signup(user: CreateUserDto): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email: user.email },
    });
  }

  async updateUser(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
    });
  }

  async deletUser(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
    });
  }
}
