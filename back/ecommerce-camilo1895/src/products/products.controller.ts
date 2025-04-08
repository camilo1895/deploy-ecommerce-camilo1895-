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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from 'src/dtos/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() product: ProductDto) {
    return this.productsService.createProduct(product);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateProductById() {
    return this.productsService.updateProductById();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteProductById() {
    return this.productsService.deleteProductById();
  }
}
