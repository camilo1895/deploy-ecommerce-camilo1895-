import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './products.entity';

@Entity({
  name: 'categories',
})
export class Category {
  @ApiProperty({
    description: 'ID único de la categoría (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónicos',
    maxLength: 50,
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Productos asociados a esta categoría',
    type: () => [Product], // Para evitar circular dependency
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Laptop HP',
        price: 999.99,
      },
    ],
  })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
