import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LoginUserDto {
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
}
