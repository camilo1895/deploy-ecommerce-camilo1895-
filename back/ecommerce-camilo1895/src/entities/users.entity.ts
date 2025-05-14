import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './orders.entity';

@Entity({
  name: 'users',
})
export class User {
  @ApiProperty({
    description: 'ID único del usuario (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    maxLength: 50,
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Email del usuario (debe ser único)',
    example: 'usuario@example.com',
    maxLength: 50,
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ type: 'varchar', length: 150, nullable: false })
  password: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 3512345678,
    type: 'integer',
  })
  @Column({ type: 'int' })
  phone: number;

  @ApiProperty({
    description: 'País del usuario (opcional)',
    example: 'Argentina',
    maxLength: 50,
    required: false,
  })
  @Column({ type: 'varchar', length: 50 })
  country?: string | undefined;

  @ApiProperty({
    description: 'Dirección completa del usuario',
    example: 'Calle Falsa 123, Piso 4, Departamento B',
    required: true,
  })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({
    description: 'Ciudad del usuario (opcional)',
    example: 'Córdoba',
    maxLength: 50,
    required: false,
  })
  @Column({ type: 'varchar', length: 50 })
  city?: string | undefined;

  @ApiProperty({
    description: 'Rol del usuario (por defecto "user")',
    example: 'user',
    enum: ['user', 'admin'],
    default: 'user',
  })
  @Column({ default: 'user' })
  isAdmin: string;

  @ApiProperty({
    description: 'Órdenes realizadas por el usuario',
    type: () => [Order],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        date: '2023-05-15T14:30:00Z',
      },
    ],
  })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
