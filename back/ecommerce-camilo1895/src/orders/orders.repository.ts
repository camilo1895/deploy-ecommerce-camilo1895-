import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/orders.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async getOrder(id: string): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderDetails', 'orderDetails.products'],
    });
  }

  async addOrder(userId: string): Promise<Order> {
    const createUserOrder = this.orderRepository.create({
      user: { id: userId },
      date: new Date(),
    });

    return await this.orderRepository.save(createUserOrder);
  }

  async updateOrder(order: Order) {
    return await this.orderRepository.update(order.id, order);
  }
}
