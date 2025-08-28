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
import { ApiProperty } from '@nestjs/swagger';
import { OrderProductDto } from './orderProduct.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'El identificador de usuario no puede estar vacío',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El identificador de usuario no puede estar vacío' })
  @IsString({ message: 'El ID debe ser una cadena de texto' })
  @IsUUID('4', {
    message:
      'El ID debe ser un UUID v4 válido (ej: 123e4567-e89b-12d3-a456-426614174000)',
  })
  userId: string;

  @ApiProperty({
    description: 'Los productos deben ser proporcionados como un array',
    example: [
      { id: '550e8400-e29b-41d4-a716-446655440000' },
      { id: '550e8400-e29b-41d4-a716-446655440001' },
    ],
  })
  @IsArray({ message: 'Los productos deben ser proporcionados como un array' })
  @ArrayNotEmpty({ message: 'El array de productos no puede estar vacío' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos 1 producto' })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];
}
