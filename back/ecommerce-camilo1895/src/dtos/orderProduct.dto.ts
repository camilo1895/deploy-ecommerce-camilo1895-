import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class OrderProductDto {
  @IsNotEmpty({ message: 'El identificador de usuario no puede estar vacío' })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsUUID('4', {
    message:
      'El ID debe ser un UUID v4 válido (ej: 123e4567-e89b-12d3-a456-426614174000)',
  })
  id: string;
}
