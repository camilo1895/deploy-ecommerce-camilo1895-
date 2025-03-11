import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  /*@Column({ type: 'varchar', nullable: false })
  confirmarPassword: string;*/

  @Column({ type: 'text' })
  address: string;

  @Column('bigint') // Pendiente integer solo permite 9 digitos
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true }) // Se agrega nullable: true para que sea igual a la estrucutura del tipo de dato que no sea obligatorio
  country?: string;

  @Column({ type: 'varchar', length: 50, nullable: true }) // Se agrega nullable: true para que sea igual a la estrucutura del tipo de dato que no sea obligatorio
  city?: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: 'orders_id' })
  orders: Order[];
}
