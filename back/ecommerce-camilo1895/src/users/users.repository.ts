import { Injectable } from '@nestjs/common';
import { CredentialDto } from 'src/dtos/signin.dto';
import { UserDto } from 'src/dtos/users.dto';
import { User } from 'src/entities/users.entity';

@Injectable()
export class UsersRepository {
  public users: User[] = [
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

  async getUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    const listUser = this.users.map(({ password, ...rest }) => rest);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return listUser.slice(startIndex, endIndex);
  }

  async getUserById(id: number): Promise<Omit<User, 'password'> | string> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return 'Usuario no existe';
    }
    const { password, ...rest } = user;

    return rest;
  }

  signin(credential: CredentialDto) {
    const existUser = this.users.find(
      (user) =>
        user.email === credential.email &&
        user.password === credential.password,
    );

    if (!existUser) {
      return 'Los datos son incorrectos';
    }

    return 'Ingreso exitoso';
  }

  createUser(user: UserDto) {
    const userId = this.users.length + 1;

    const newUser = {
      id: userId,
      email: user.email,
      name: user.name,
      password: user.password,
      address: user.address,
      phone: user.phone,
      country: user.country,
      city: user.city,
    };

    return this.users.push(newUser);
  }

  updateUserById(id: number) {
    return this.users.findIndex((user) => user.id === id);
  }

  deleteUserById(id: number) {
    return this.users.findIndex((user) => user.id === id);
  }
}
