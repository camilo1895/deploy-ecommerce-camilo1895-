import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<Partial<UsersRepository>>;
  let userRepo: Partial<Repository<User>>;
  let hashedPassword: string;

  const mockUser: CreateUserDto = {
    email: 'test@example.com',
    name: 'Juan',
    password: 'Password123!',
    confirmarPassword: 'Password123!',
    address: 'Calle 123',
    phone: '+573001234567',
    country: 'Colombia',
    city: 'Bogotá',
  };

  const userId = '313c5f3a-6b6d-4179-8287-2bd8d7aa959b';

  beforeEach(async () => {
    const signupMock = jest.fn() as jest.MockedFunction<
      (user: CreateUserDto) => Promise<User | null>
    >;
    signupMock.mockResolvedValue(null);

    hashedPassword = await bcrypt.hash(mockUser.password, 10);

    userRepo = {
      create: jest.fn().mockImplementation((user: Partial<User>) => ({
        id: userId,
        password: hashedPassword,
        isAdmin: false,
        orders: [],
        ...user,
      })) as jest.MockedFunction<Repository<User>['create']>,

      save: jest
        .fn()
        .mockImplementation((newUser: User) =>
          Promise.resolve(newUser),
        ) as jest.MockedFunction<Repository<User>['save']>,
    };

    usersRepository = {
      signup: signupMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepository },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('Valida si la contraseña fue hashed', async () => {
    const userData = {
      ...mockUser,
      id: userId,
    };

    const result = await usersService.signup(userData);
    expect(result).toBeDefined();
    expect(mockUser.password).not.toEqual(hashedPassword);
  });
});
