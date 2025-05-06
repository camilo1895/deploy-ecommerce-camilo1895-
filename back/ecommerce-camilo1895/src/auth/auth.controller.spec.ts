import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { LoginUserDto } from 'src/dtos/loginUser.dto';
import { User } from 'src/entities/users.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;
  let mockUserService: Partial<UsersService>;

  const mockPeticionUser: CreateUserDto = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    password: 'Abc123!@#',
    validatePassword: 'Abc123!@#',
    address: 'Calle Falsa 123',
    phone: 7777777,
    country: 'Colombia',
    city: 'Medellín',
  };
  const mockCredential = {
    success: 'User logged in successfully',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYTY2YzRlMy1hMDY2LTQzMzYtYWU5Zi00MTE2OWRhNDNkMGYiLCJpZCI6ImNhNjZjNGUzLWEwNjYtNDMzNi1hZTlmLTQxMTY5ZGE0M2QwZiIsImVtYWlsIjoianVhbi5wZXJlekBleGFtcGxlLmNvbSIsImlzQWRtaW4iOiJhZG1pbiIsImlhdCI6MTc0NjIzMzcyMiwiZXhwIjoxNzQ2MjM3MzIyfQ.d_HJ1m3a1F6HS9qdvNdMFQqtcLKj2jPKST7vZEyYQJc',
  };

  beforeEach(async () => {
    mockUserService = {
      signup: (user: CreateUserDto) =>
        Promise.resolve({
          id: 'ca66c4e3-a066-4336-ae9f-41169da43d0f',
          name: 'Juan Pérez',
          email: 'juan.perez@example.com',
          phone: 7777777,
          country: 'Colombia',
          address: 'Calle Falsa 123',
          city: 'Medellín',
        } as User),
    };

    mockAuthService = {
      signin: (credential: LoginUserDto) =>
        Promise.resolve({ ...mockCredential }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signup() create user', async () => {
    const createUser = await controller.signup(mockPeticionUser);

    expect(createUser).toEqual({
      id: 'ca66c4e3-a066-4336-ae9f-41169da43d0f',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: 7777777,
      country: 'Colombia',
      address: 'Calle Falsa 123',
      city: 'Medellín',
    });
  });
});
