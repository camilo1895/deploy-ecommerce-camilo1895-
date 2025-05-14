import { IsNotEmpty, IsString, IsNumber, IsInt, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop HP Pavilion',
  })
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop con 16GB RAM y SSD 512GB',
  })
  @IsNotEmpty({ message: 'La descripción del producto es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  @ApiProperty({
    description: 'Precio del producto (número con decimales)',
    example: 1299.99,
  })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe tener máximo 2 decimales' },
  )
  price: number;

  @ApiProperty({
    description: 'Cantidad en stock (número entero)',
    example: 50,
  })
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  imgUrl?: string;
}
