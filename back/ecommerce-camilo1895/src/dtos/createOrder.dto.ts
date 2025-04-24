import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Product } from 'src/entities/products.entity';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'El identificador de usuario no puede estar vacío' })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsUUID('4', {
    message:
      'El ID debe ser un UUID v4 válido (ej: 123e4567-e89b-12d3-a456-426614174000)',
  })
  userId: string;

  @IsArray({ message: 'Los productos deben ser proporcionados como un array' })
  @ArrayNotEmpty({ message: 'El array de productos no puede estar vacío' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos 1 producto' })
  @ValidateNested({ each: true })
  @Type(() => Product)
  products: Partial<Product>[];
}
