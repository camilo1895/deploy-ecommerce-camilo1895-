import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 80, {
    message: 'El nombre debe tener entre 3 y 80 caracteres',
  })
  name: string;

  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

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

  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  address: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsNumber({}, { message: 'El teléfono debe ser un número' })
  @Min(1000000, { message: 'El teléfono debe tener al menos 7 dígitos' })
  @Max(9999999999, {
    message: 'El teléfono no puede exceder los 20 dígitos',
  })
  phone: number;

  @IsNotEmpty({ message: 'El país es obligatorio' })
  @IsString({ message: 'El país debe ser texto' })
  @Length(5, 20, { message: 'El país debe tener entre 5 y 20 caracteres' })
  country: string;

  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @IsString({ message: 'La ciudad debe ser texto' })
  @Length(5, 20, { message: 'La ciudad debe tener entre 5 y 20 caracteres' })
  city: string;
}
