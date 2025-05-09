import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/createUser.dto';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        address: true,
        city: true,
        isAdmin: true,
        orders: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        orders: true,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        address: true,
        city: true,
        orders: true,
      },
      where: { id },
      relations: {
        orders: true,
      },
    });
  }

  async emailExists(email: string): Promise<boolean> {
    return this.userRepository.exists({ where: { email } });
  }

  async signin(credential: LoginUserDto): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: credential.email },
    });
  }

  async signup(
    user: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'isAdmin'> | null> {
    const { validatePassword, ...userData } = user;

    const saveUser = this.userRepository.create(userData);

    await this.userRepository.save(saveUser);

    return await this.userRepository.findOne({
      where: { email: user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        address: true,
        city: true,
        orders: true,
      },
    });
  }

  async updateUserById(id: string, user: CreateUserDto): Promise<User | null> {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteUserById(id: string) {
    return await this.userRepository.delete(id);
  }
}
