import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.findAll(
      Number(page),
      Number(limit),
    );

    return users.map(({ password, ...rest }) => rest); // Remueve el password de cada usuario
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.getUserById(id);

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async signup(
    user: CreateUserDto,
  ): Promise<Omit<CreateUserDto, 'password' | 'confirmarPassword'>> {
    const existingUser = await this.usersRepository.signup(user);

    if (existingUser) {
      throw new ConflictException('Usuario ya existe');
    }

    const hashedPassword: string = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) {
      throw new NotFoundException('Password could not be hashed');
    }

    const newUser = this.userRepo.create({
      ...user,
      password: hashedPassword,
    });

    const saveUser = await this.userRepo.save(newUser);

    const { password, ...rest } = saveUser;

    return rest;
  }

  async updateUser(id: string, userUpdate: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.updateUser(id);

    if (!user) throw new NotFoundException('Usuario no existe');

    if (userUpdate.email) {
      user.email = userUpdate.email;
    }
    if (userUpdate.name) {
      user.name = userUpdate.name;
    }
    if (userUpdate.password) {
      user.password = userUpdate.password;
    }
    if (userUpdate.address) {
      user.address = userUpdate.address;
    }
    if (userUpdate.phone) {
      user.phone = userUpdate.phone;
    }
    if (userUpdate.country) {
      user.country = userUpdate.country;
    }
    if (userUpdate.city) {
      user.city = userUpdate.city;
    }

    return await this.userRepo.save(user);
  }

  async deleteUser(userId: string): Promise<string> {
    const user = await this.usersRepository.deletUser(userId);

    if (!user) throw new NotFoundException('Usuario no existe');

    await this.userRepo.delete(user.id);

    return 'Usuario eleminado correctamente';
  }
}
