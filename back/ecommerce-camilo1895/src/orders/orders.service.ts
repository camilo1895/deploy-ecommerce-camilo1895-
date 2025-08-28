import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from '../dtos/createOrder.dto';
import { UsersRepository } from '../users/users.repository';
import { ProductsRepository } from '../products/products.repository';
import { OrderDetails } from '../entities/orderDetails.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productRepository: ProductsRepository,
    @InjectRepository(OrderDetails)
    private oderDetailRepository: Repository<OrderDetails>,
  ) {}

  async getOrder(id: string): Promise<Order> {
    const resultOrder = await this.ordersRepository.getOrder(id);

    if (!resultOrder) {
      throw new NotFoundException('Order no existe');
    }

    return resultOrder;
  }

  async addOrder(order: CreateOrderDto): Promise<Order> {
    //Buscar al usuario por su id
    const validateUser = await this.usersRepository.getUserById(order.userId);

    if (!validateUser) {
      throw new NotFoundException('Usuario no existe');
    }

    let totalPrice: number = 0;

    //Crea una orden para ese usuario
    const createOrdersUser = await this.ordersRepository.addOrder(
      validateUser.id,
    );

    // Buscar productos por sus id y validar stock
    const validateProduct = await Promise.all(
      order.products.map(async (product) => {
        if (!product.id) {
          throw new NotFoundException('El ID del producto es requerido');
        }

        // Valida si existe producto
        const existsProduct = await this.productRepository.getProductById(
          product.id,
        );

        if (!existsProduct) {
          throw new NotFoundException(
            `Producto con ID ${product.id} no existe`,
          );
        }

        //Acumulas el total sumando los precios de los productos.
        totalPrice += Number(existsProduct.price);

        //Reduces el stock de cada producto en memoria (aún no guardas nada).
        existsProduct.stock -= 1;

        await this.productRepository.updateProductStock(
          product.id,
          existsProduct,
        );

        return existsProduct;
      }),
    );

    const filterValidateProduct = validateProduct.filter(
      (product) => typeof product !== 'string',
    );

    const createOrderDetails = {
      price: totalPrice,
      order: createOrdersUser,
      products: filterValidateProduct,
    };

    await this.oderDetailRepository.save(createOrderDetails);

    await this.ordersRepository.updateOrder(createOrdersUser);

    const result = await this.ordersRepository.getOrder(createOrdersUser.id);

    if (!result) {
      throw new NotFoundException('Order no existe');
    }

    return result;
  }
}
