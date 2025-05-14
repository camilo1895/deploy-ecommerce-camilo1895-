import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dtos/createOrder.dto';
import { Order } from '../entities/orders.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Crea una nueva orden',
    description: 'Crea un nuevo registro de orden/pedido en el sistema',
  })
  @Post()
  async addOrder(@Body() order: CreateOrderDto): Promise<Order> {
    return await this.ordersService.addOrder(order);
  }

  @ApiOperation({
    summary: 'Obtiene una orden por ID',
    description:
      'Recupera los detalles completos de una orden específica mediante su ID UUID',
  })
  @Get(':id')
  async getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ordersService.getOrder(id);
  }
}
