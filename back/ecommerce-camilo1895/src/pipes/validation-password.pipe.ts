import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';

@Injectable()
export class ValidationPasswordPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    if (value.password !== value.confirmarPassword) {
      throw new NotFoundException('Los datos ingresados no son válidos');
    }

    return value;
  }
}
