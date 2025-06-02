import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'El nombre no puede estar vacío',
    example: 'Juan Pérez',
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' }) // 'El nombre no puede estar vacío'
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 80, {
    message: 'El nombre debe tener entre 3 y 80 caracteres',
  })
  name: string;

  @ApiProperty({
    description: 'Debe ser un correo electrónico válido',
    example: 'usuario@ejemplo.com',
  })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @ApiProperty({
    description:
      'La contraseña debe tener entre 8 y 15 caracteres, contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
    example: 'Password123!',
  })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'La contraseña debe contener al menos una letra minúscula',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'La contraseña debe contener al menos una letra mayúscula',
  })
  @Matches(/(?=.*\d)/, {
    message: 'La contraseña debe contener al menos un número',
  })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos un carácter especial (!@#$%^&*)',
  })
  @Matches(/^[a-zA-Z\d!@#$%^&*]+$/, {
    message: 'La contraseña solo puede contener letras, números y !@#$%^&*',
  })
  password: string;

  @ApiProperty({
    description: 'Debe coincidir con el campo password',
    example: 'Password123!',
  })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'La contraseña debe contener al menos una letra minúscula',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'La contraseña debe contener al menos una letra mayúscula',
  })
  @Matches(/(?=.*\d)/, {
    message: 'La contraseña debe contener al menos un número',
  })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos un carácter especial (!@#$%^&*)',
  })
  @Matches(/^[a-zA-Z\d!@#$%^&*]+$/, {
    message: 'La contraseña solo puede contener letras, números y !@#$%^&*',
  })
  validatePassword: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  address: string;

  @ApiProperty({
    description: 'El teléfono debe tener al menos 7 dígitos',
    example: 3512345678,
  })
  @ApiProperty({
    description: 'El teléfono debe tener entre 7 y 10 dígitos numéricos',
    example: '3512345678',
  })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser texto' })
  @Matches(/^\d{7,10}$/, {
    message: 'El teléfono debe tener entre 7 y 10 dígitos numéricos',
  })
  phone: string;

  @ApiProperty({
    description: 'El país debe tener entre 5 y 20 caracteres',
    example: 'Argentina',
  })
  @IsNotEmpty({ message: 'El país es obligatorio' })
  @IsString({ message: 'El país debe ser texto' })
  @Length(5, 20, { message: 'El país debe tener entre 5 y 20 caracteres' })
  country: string;

  @ApiProperty({
    description: 'La ciudad debe tener entre 5 y 20 caracteres',
    example: 'Córdoba',
  })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @IsString({ message: 'La ciudad debe ser texto' })
  @Length(5, 20, { message: 'La ciudad debe tener entre 5 y 20 caracteres' })
  city: string;

  @IsOptional({ message: 'El rol no es obligatorio' })
  @IsString({ message: 'El rol debe ser un texto' })
  isAdmin?: string;
}
