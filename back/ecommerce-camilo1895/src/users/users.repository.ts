import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { LoginUserDto } from 'src/dtos/loginUse.dto';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  /*
      id: 1,
      email: 'juan@example.com',
      name: 'Juan Pérez',
      password: 'securePass123',
      address: 'Calle 123, Bogotá',
      phone: '+57 3001234567',
      country: 'Colombia',
      city: 'Bogotá',
    },
     */

  async getUsers(page: number, limit: number): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'name',
        'email',
        'phone',
        'country',
        'address',
        'city',
        'orders',
      ],
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        orders: true,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      select: [
        'id',
        'name',
        'email',
        'phone',
        'country',
        'address',
        'city',
        'orders',
      ],
      where: { id },
      relations: {
        orders: true,
      },
    });
  }

  async signin(credential: LoginUserDto): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: credential.email, password: credential.password },
    });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const saveUser = this.userRepository.create(user);

    return this.userRepository.save(saveUser);
  }

  async updateUserById(id: string, user: CreateUserDto): Promise<User | null> {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteUserById(id: string) {
    return await this.userRepository.delete(id);
  }
}
