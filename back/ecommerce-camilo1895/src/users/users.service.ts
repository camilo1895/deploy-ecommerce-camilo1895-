import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(page: number, limit: number): Promise<User[]> {
    return this.usersRepository.getUsers(page, limit);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('Usuario no existe');
    }

    return user;
  }

  async signup(user: CreateUserDto): Promise<User> {
    // Validación de contraseña
    if (user.password !== user.validatePassword) {
      throw new NotFoundException('Password no coincide');
    }

    // Validar si el email ya existe
    const validateEmail = await this.usersRepository.emailExists(user.email);

    if (validateEmail) {
      throw new NotFoundException('Usuario ya registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) {
      throw new NotFoundException('Password could not be hashed');
    }

    const userHashedPassword = { ...user, password: hashedPassword };

    // Crear usuario
    const saveUser = await this.usersRepository.signup(userHashedPassword);

    if (!saveUser) {
      throw new NotFoundException('Usuario no se creo correctamente');
    }

    return saveUser;
  }

  async updateUserById(id: string, user: CreateUserDto): Promise<User> {
    const validateUser = await this.usersRepository.getUserById(id);

    if (!validateUser) {
      throw new NotFoundException('Usuario no existe');
    }

    const updateResult = await this.usersRepository.updateUserById(id, user);

    if (!updateResult) {
      throw new NotFoundException('Error al retornar usuario actualizado');
    }
    return updateResult;
  }

  async deleteUserById(id: string) {
    const validateUser = await this.usersRepository.getUserById(id);

    if (!validateUser) {
      throw new NotFoundException('Usuario no existe');
    }

    return await this.usersRepository.deleteUserById(id);
  }
}
