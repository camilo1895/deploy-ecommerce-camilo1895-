import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from '../entities/orderDetails.entity';
import { Order } from '../entities/orders.entity';
import { Product } from '../entities/products.entity';
import { User } from '../entities/users.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(OrderDetail)
    private orderDetailRepo: Repository<OrderDetail>,
  ) {}

  async addOrder(userId: string, products: Partial<Product>[]) {
    let total = 0;
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no existe');
    }

    const orderCreate = this.orderRepo.create({
      user,
      date: new Date(),
    });

    const order = await this.orderRepo.save(orderCreate);

    const recorreArray = await Promise.all(
      products.map(async (element) => {
        const product = await this.productRepo.findOne({
          where: { id: element.id, stock: MoreThan(0) },
        });

        if (!product) {
          throw new NotFoundException(
            'Producto no existe o no cuenta con stock',
          );
        }

        total += Number(product.price);

        await this.productRepo.update(
          { id: element.id },
          {
            stock: product.stock - 1,
          },
        );
        return product;
      }),
    );

    const orderDetail = this.orderDetailRepo.create({
      price: total,
      order,
      product: recorreArray,
    });

    await this.orderDetailRepo.save(orderDetail);

    return await this.orderRepo.find({
      where: { id: order.id },
      relations: ['orderDetail'],
    });
  }

  async getOrder(id: string) {
    return await this.orderRepo.findOne({
      where: { id },
      relations: {
        orderDetail: {
          product: true,
        },
      },
    });
  }
}
