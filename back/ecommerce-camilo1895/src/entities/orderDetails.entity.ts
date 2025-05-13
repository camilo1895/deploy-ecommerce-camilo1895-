import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Product } from './products.entity';

@Entity({
  name: 'orderDetails',
})
export class OrderDetails {
  @ApiProperty({
    description: 'ID único del detalle de orden (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Precio total del pedido',
    example: 299.99,
    type: 'number',
    format: 'decimal',
    minimum: 0.01,
    maximum: 9999999.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({
    description: 'Orden asociada a estos detalles',
    type: () => Order, // Para evitar referencia circular
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: '2023-05-15T10:00:00Z',
    },
  })
  @OneToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @ApiProperty({
    description: 'Productos incluidos en este pedido',
    type: () => [Product], // Para arrays y evitar circularidad
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Smartphone X',
        price: 299.99,
      },
    ],
  })
  @ManyToMany(() => Product, (product) => product.orderDetails)
  @JoinTable({ name: 'order_details_products' })
  products: Product[]; // Nota: Corregí el nombre a "products" (plural)
}
