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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @OneToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @ManyToMany(() => Product, (product) => product.orderDetails)
  @JoinTable({ name: 'order_details_products' })
  product: Product[];
}
