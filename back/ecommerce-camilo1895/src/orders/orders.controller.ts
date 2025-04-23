import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/dtos/createOrderDto.dto';
import { Order } from 'src/entities/orders.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async addOrder(
    @Body() order: CreateOrderDto,
  ): Promise<Order | string | null> {
    return await this.ordersService.addOrder(order);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return await this.ordersService.getOrder(id);
  }
}
