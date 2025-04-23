import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialDto } from 'src/dtos/signin.dto';
import { UserDto } from 'src/dtos/users.dto';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  /*  public users: User[] = [
    {
      id: 1,
      email: 'juan@example.com',
      name: 'Juan Pérez',
      password: 'securePass123',
      address: 'Calle 123, Bogotá',
      phone: '+57 3001234567',
      country: 'Colombia',
      city: 'Bogotá',
    },
    {
      id: 2,
      email: 'maria@example.com',
      name: 'María Gómez',
      password: 'mariaPass456',
      address: 'Av. Principal 456, Medellín',
      phone: '+57 3012345678',
      country: 'Colombia',
      city: 'Medellín',
    },
    {
      id: 3,
      email: 'carlos@example.com',
      name: 'Carlos López',
      password: 'carlosSecure789',
      address: 'Carrera 7, Cali',
      phone: '+57 3123456789',
    },
    {
      id: 4,
      email: 'ana@example.com',
      name: 'Ana Ramírez',
      password: 'anaPass999',
      address: 'Calle 8, Barranquilla',
      phone: '+57 3223456789',
      country: 'Colombia',
    },
  ]; */

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

  async signin(credential: CredentialDto): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: credential.email, password: credential.password },
    });
  }

  async createUser(user: UserDto): Promise<User> {
    const saveUser = this.userRepository.create(user);

    return this.userRepository.save(saveUser);
  }

  async updateUserById(id: string, user: UserDto): Promise<User | null> {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteUserById(id: string) {
    return await this.userRepository.delete(id);
  }
}
