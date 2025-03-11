import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Product } from '../entities/products.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async addOrder(userId: string, products: Partial<Product>[]) {
    const createOrder = await this.ordersRepository.addOrder(userId, products);
    if (!createOrder) throw new NotFoundException('Oden no creada');
    return createOrder;
  }

  async getOrder(id: string) {
    const order = await this.ordersRepository.getOrder(id);
    if (!order) throw new NotFoundException('La orden no existe');
    return order;
  }
}
