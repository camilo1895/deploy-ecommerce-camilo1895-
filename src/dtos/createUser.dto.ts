import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Correo inválido',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(3, 80) // Mínimo 3 caracteres, máximo 80
  @Matches(/^[A-Za-z]+$/, { message: 'El nombre solo puede contener letras' })
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Debe contener al menos una minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Debe contener al menos una minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
  })
  confirmarPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 80) // Mínimo 3 caracteres, máximo 80
  address: string;

  @IsNotEmpty()
  @IsPhoneNumber('CO', { message: 'Número de teléfono inválido' })
  @IsString()
  phone: string;

  @IsString()
  @Length(5, 20) // Mínimo 5 caracteres, máximo 20
  country?: string | undefined;

  @IsString()
  @Length(5, 20) // Mínimo 5 caracteres, máximo 20
  city?: string | undefined;
}
