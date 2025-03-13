import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { AuthRepository } from '../auth/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository, AuthRepository],
  controllers: [UsersController],
  exports: [UsersService], // Exportar para que otros módulos lo usen
})
export class UsersModule {}
