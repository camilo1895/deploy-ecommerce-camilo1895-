import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { OrderDetails } from './orderDetails.entity';

@Entity({
  name: 'orders',
})
export class Order {
  @ApiProperty({
    description: 'ID único del pedido (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Usuario que realizó el pedido',
    type: () => User,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Juan Pérez',
      email: 'juan@example.com',
    },
  })
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'Fecha del pedido en formato ISO 8601',
    example: '2023-05-15T14:30:00Z',
    type: Date,
  })
  @Column()
  date: Date;

  @ApiProperty({
    description: 'Detalles específicos del pedido',
    type: () => OrderDetails,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      price: 299.99,
      products: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Smartphone X',
          price: 299.99,
        },
      ],
    },
  })
  @OneToOne(() => OrderDetails, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetails;
}
