import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from 'src/dtos/products.dto';
import { Product } from 'src/entities/products.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts(
    @Query('page') page: number = 1,
    @Query('limite') limit: number = 5,
  ) {
    return this.productsService.getProducts(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() product: ProductDto) {
    return this.productsService.createProduct(product);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  updateProductById(@Param('id') id: string, @Body() product: ProductDto) {
    return this.productsService.updateProductById(Number(id), product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteProductById(@Param('id') id: string) {
    return this.productsService.deleteProductById(Number(id));
  }
}
