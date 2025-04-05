import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/users.entity';

@Injectable()
export class UsersRepository {
  private users: User[] = [
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
  ];

  async getUsers(): Promise<User[]> {
    return this.users;
  }
}
