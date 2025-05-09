import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { LoginUserDto } from '../dtos/loginUser.dto';
import { User } from '../entities/users.entity';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import bcrypt from 'bcrypt';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;
  let mockUserService: Partial<UsersService>;
  let mockUsersRepository: Partial<UsersRepository>;

  const mockCreateUser: CreateUserDto = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    password: 'Abc123!@#',
    validatePassword: 'Abc123!@#',
    address: 'Calle Falsa 123',
    phone: 7777777,
    country: 'Colombia',
    city: 'Medellín',
  };

  const mockCreateUserErrorPassword: CreateUserDto = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    password: 'Abc123!@#',
    validatePassword: 'Abc123!@',
    address: 'Calle Falsa 123',
    phone: 7777777,
    country: 'Colombia',
    city: 'Medellín',
  };

  const mockReturnUser: Omit<User, 'password' | 'isAdmin'> = {
    id: 'ca66c4e3-a066-4336-ae9f-41169da43d0f',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: 7777777,
    country: 'Colombia',
    address: 'Calle Falsa 123',
    city: 'Medellín',
    orders: [],
  };

  beforeEach(async () => {
    mockUserService = {
      signup: (
        user: CreateUserDto,
      ): Promise<Omit<User, 'password' | 'isAdmin'>> =>
        Promise.resolve(mockReturnUser),
    };

    mockUsersRepository = {
      emailExists: (email: string): Promise<boolean> => Promise.resolve(true),

      signup: (
        user: CreateUserDto,
      ): Promise<Omit<User, 'password' | 'isAdmin'> | null> =>
        Promise.resolve(null),
    };

    mockAuthService = {
      signin: (credential: LoginUserDto) => Promise.resolve(mockResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUserService },
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signup() Should throw error if password not match', async () => {
    mockUserService.signup = (
      user: CreateUserDto,
    ): Promise<Omit<User, 'password' | 'isAdmin'>> => {
      // Validación de contraseña
      if (user.password !== user.validatePassword) {
        throw new NotFoundException('Password no coincide');
      }

      return Promise.resolve(mockReturnUser);
    };

    await expect(
      controller.signup(mockCreateUserErrorPassword),
    ).rejects.toThrow('Password no coincide');
  });

  it('signup() Should throw error if email exists', async () => {
    mockUserService.signup = async (
      user: CreateUserDto,
    ): Promise<Omit<User, 'password' | 'isAdmin'>> => {
      // Validación de contraseña
      if (user.password !== user.validatePassword) {
        throw new NotFoundException('Password no coincide');
      }

      // Validar si el email ya existe
      const validateEmail = await mockUsersRepository.emailExists?.(user.email);

      if (validateEmail) {
        throw new NotFoundException('Usuario ya registrado');
      }

      return Promise.resolve(mockReturnUser);
    };

    await expect(controller.signup(mockCreateUser)).rejects.toThrow(
      'Usuario ya registrado',
    );
  });

  it('signup() Should return user if password is hashed', async () => {
    mockUsersRepository = {
      emailExists: (email: string): Promise<boolean> => Promise.resolve(false),
    };

    mockUserService.signup = async (
      user: CreateUserDto,
    ): Promise<Omit<User, 'password' | 'isAdmin'>> => {
      // Validación de contraseña
      if (user.password !== user.validatePassword) {
        throw new NotFoundException('Password no coincide');
      }

      // Validar si el email ya existe
      const validateEmail = await mockUsersRepository.emailExists?.(user.email);

      if (validateEmail) {
        throw new NotFoundException('Usuario ya registrado');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(user.password, 10);

      if (!hashedPassword) {
        throw new NotFoundException('Password could not be hashed');
      }

      return Promise.resolve(mockReturnUser);
    };
    const result = await controller.signup(mockCreateUser);
    expect(result).toEqual(mockReturnUser);
  });

  it('signup() Should throw error if user not be save', async () => {
    mockUsersRepository = {
      emailExists: (email: string): Promise<boolean> => Promise.resolve(false),
    };

    mockUserService.signup = async (
      user: CreateUserDto,
    ): Promise<Omit<User, 'password' | 'isAdmin'>> => {
      // Validación de contraseña
      if (user.password !== user.validatePassword) {
        throw new NotFoundException('Password no coincide');
      }

      // Validar si el email ya existe
      const validateEmail = await mockUsersRepository.emailExists?.(user.email);

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
      const saveUser = await mockUsersRepository.signup?.(userHashedPassword);

      if (!saveUser) {
        throw new NotFoundException('Usuario no se creo correctamente');
      }

      return Promise.resolve(saveUser);
    };

    await expect(controller.signup(mockCreateUser)).rejects.toThrow(
      'Usuario no se creo correctamente',
    );
  });

  it('signup() Should create new user', async () => {
    mockUsersRepository = {
      emailExists: (email: string): Promise<boolean> => Promise.resolve(false),

      signup: (
        user: CreateUserDto,
      ): Promise<Omit<User, 'password' | 'isAdmin'> | null> =>
        Promise.resolve(mockReturnUser),
    };

    mockUserService.signup = async (
      user: CreateUserDto,
    ): Promise<Omit<User, 'password' | 'isAdmin'>> => {
      // Validación de contraseña
      if (user.password !== user.validatePassword) {
        throw new NotFoundException('Password no coincide');
      }

      // Validar si el email ya existe
      const validateEmail = await mockUsersRepository.emailExists?.(user.email);

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
      const saveUser = await mockUsersRepository.signup?.(userHashedPassword);

      if (!saveUser) {
        throw new NotFoundException('Usuario no se creo correctamente');
      }

      return Promise.resolve(saveUser);
    };

    const result = await controller.signup(mockCreateUser);

    expect(result).toBe(mockReturnUser);
  });

  /* 



  it('signup() Should create a new user', async () => {
    const createUser = await controller.signup(mockCreateUser);

    expect(createUser).toEqual(mockReturnUser);
  });
 */

  /*it('signin() Should token if login is successful', async () => {
    const validateCredential = await controller.signin(mockCredential);

    expect(validateCredential).toEqual(mockResponse);
  });

  it('signin() Should throw error if login fails', async () => {


    await expect(controller.signin(mockCredential)).rejects.toThrow(
      'Los datos son incorrectos',
    );
  }); */

  const mockCredential: LoginUserDto = {
    email: 'juan.perez@example.com',
    password: 'Abc123!@#',
  };

  const mockResponse = {
    success: 'User logged in successfully',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYTY2YzRlMy1hMDY2LTQzMzYtYWU5Zi00MTE2OWRhNDNkMGYiLCJpZCI6ImNhNjZjNGUzLWEwNjYtNDMzNi1hZTlmLTQxMTY5ZGE0M2QwZiIsImVtYWlsIjoianVhbi5wZXJlekBleGFtcGxlLmNvbSIsImlzQWRtaW4iOiJhZG1pbiIsImlhdCI6MTc0NjIzMzcyMiwiZXhwIjoxNzQ2MjM3MzIyfQ.d_HJ1m3a1F6HS9qdvNdMFQqtcLKj2jPKST7vZEyYQJc',
  };
});
