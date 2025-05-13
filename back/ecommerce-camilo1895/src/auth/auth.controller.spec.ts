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
import { JwtService } from '@nestjs/jwt';
import { sign } from 'crypto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;
  let mockJwtService: Partial<JwtService>;
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

  const mockCredentialErrorPassword: LoginUserDto = {
    email: 'juan.perez@example.com',
    password: 'Abc123!@',
  };

  const mockCredential: LoginUserDto = {
    email: 'juan.perez@example.com',
    password: 'Abc123!@#',
  };

  const mockUser: User = {
    id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    password: '$2b$10$D/AHVXmpWML8hCWPS59g1e0aNp5j3ConpXp4n0aUK6clEyOEY5lHa',
    phone: 3412345678,
    country: 'Argentina',
    address: 'Calle Falsa 123',
    city: 'Rosario',
    isAdmin: 'user',
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

      signin: (credential: LoginUserDto): Promise<User | null> =>
        Promise.resolve(null),
    };

    mockAuthService = {
      signin: (credential: LoginUserDto) => Promise.resolve(mockResponse),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUserService },
        { provide: UsersRepository, useValue: mockUsersRepository },
        JwtService,
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

  it('signin() Should throw error if email not exists', async () => {
    mockAuthService.signin = async (
      credential: LoginUserDto,
    ): Promise<{ success: string; token: string }> => {
      const validateCredential = await mockUsersRepository.signin?.(credential);

      if (!validateCredential) {
        throw new NotFoundException('Los datos son incorrectos');
      }

      return Promise.resolve(mockResponse);
    };

    await expect(controller.signin(mockCredential)).rejects.toThrow(
      'Los datos son incorrectos',
    );
  });

  it('signin() Should throw error if isPassworValidate not valid', async () => {
    mockUsersRepository.signin = (
      credential: LoginUserDto,
    ): Promise<User | null> => Promise.resolve(mockUser);

    mockAuthService.signin = async (
      credential: LoginUserDto,
    ): Promise<{ success: string; token: string }> => {
      const validateCredential = await mockUsersRepository.signin?.(credential);

      if (!validateCredential) {
        throw new NotFoundException('Los datos son incorrectos');
      }

      const isPassworValidate = await bcrypt.compare(
        credential.password,
        validateCredential.password,
      );

      if (!isPassworValidate) {
        throw new NotFoundException('Los datos son incorrectos');
      }

      return Promise.resolve(mockResponse);
    };

    await expect(
      controller.signin(mockCredentialErrorPassword),
    ).rejects.toThrow('Los datos son incorrectos');
  });

  it('signin() should throw an error if token generation fails', async () => {
    mockJwtService.sign = jest.fn().mockImplementation(() => {
      throw new NotFoundException('Token generation failed');
    });

    mockUsersRepository.signin = (
      credential: LoginUserDto,
    ): Promise<User | null> => Promise.resolve(mockUser);

    mockAuthService.signin = async (
      credential: LoginUserDto,
    ): Promise<{ success: string; token: string }> => {
      const validateCredential = await mockUsersRepository.signin?.(credential);

      if (!validateCredential) {
        throw new NotFoundException('Los datos son incorrectos');
      }

      const isPassworValidate = await bcrypt.compare(
        credential.password,
        validateCredential.password,
      );

      if (!isPassworValidate) {
        throw new NotFoundException('Los datos son incorrectos');
      }

      const userPayLoad = {
        sub: validateCredential.id,
        id: validateCredential.id,
        email: validateCredential.email,
        isAdmin: [validateCredential.isAdmin === 'user' ? 'user' : 'admin'],
      };

      try {
        const token = mockJwtService.sign?.(userPayLoad);
        return mockResponse;
      } catch (error) {
        throw new NotFoundException('Token generation failed');
      }
    };

    await expect(controller.signin(mockCredential)).rejects.toThrow(
      'Token generation failed',
    );
  });

  /*it('signin() Should token if login is successful', async () => {
    const validateCredential = await controller.signin(mockCredential);

    expect(validateCredential).toEqual(mockResponse);
  });

  it('signin() Should throw error if login fails', async () => {


    await expect(controller.signin(mockCredential)).rejects.toThrow(
      'Los datos son incorrectos',
    );
  }); */

  const mockResponse = {
    success: 'User logged in successfully',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYTY2YzRlMy1hMDY2LTQzMzYtYWU5Zi00MTE2OWRhNDNkMGYiLCJpZCI6ImNhNjZjNGUzLWEwNjYtNDMzNi1hZTlmLTQxMTY5ZGE0M2QwZiIsImVtYWlsIjoianVhbi5wZXJlekBleGFtcGxlLmNvbSIsImlzQWRtaW4iOiJhZG1pbiIsImlhdCI6MTc0NjIzMzcyMiwiZXhwIjoxNzQ2MjM3MzIyfQ.d_HJ1m3a1F6HS9qdvNdMFQqtcLKj2jPKST7vZEyYQJc',
  };
});
