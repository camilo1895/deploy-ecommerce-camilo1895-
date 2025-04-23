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
import { AuthGuard } from 'src/auth/auth.guard';
import { Product } from 'src/entities/products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limite') limit: number = 5,
  ): Promise<Product[]> {
    return await this.productsService.getProducts(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(
    @Param('id') id: string,
  ): Promise<Product | null | string> {
    return await this.productsService.getProductById(id);
  }

  @Post('seeder')
  async precargaProducts() {
    return await this.productsService.precargaProducts();
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() product: ProductDto) {
    return await this.productsService.createProduct(product);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProductById(
    @Param('id') id: string,
    @Body() product: ProductDto,
  ): Promise<Product | string | null> {
    return await this.productsService.updateProductById(id, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProductById(@Param('id') id: string) {
    return await this.productsService.deleteProductById(id);
  }
}
