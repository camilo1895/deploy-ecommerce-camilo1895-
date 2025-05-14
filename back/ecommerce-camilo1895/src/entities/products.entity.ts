import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './categories.entity';
import { OrderDetails } from './orderDetails.entity';

@Entity({
  name: 'products',
})
export class Product {
  @ApiProperty({
    description: 'ID único del producto (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone X Pro',
    maxLength: 50,
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Teléfono inteligente con cámara de 108MP y batería de 5000mAh',
  })
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty({
    description: 'Precio del producto en USD',
    example: 799.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 100,
    minimum: 0,
  })
  @Column({ type: 'int', nullable: false })
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/product-image.jpg',
    default:
      'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&w=600',
  })
  @Column({
    type: 'varchar',
    default:
      'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&w=600',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'Categoría a la que pertenece el producto',
    type: () => Category,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Electrónicos',
    },
  })
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;

  @ApiProperty({
    description: 'Detalles de órdenes que incluyen este producto',
    type: () => [OrderDetails],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        price: 799.99,
      },
    ],
  })
  @ManyToMany(() => OrderDetails, (orderDetail) => orderDetail.products)
  orderDetails: OrderDetails[];
}
