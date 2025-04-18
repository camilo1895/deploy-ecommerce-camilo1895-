import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
