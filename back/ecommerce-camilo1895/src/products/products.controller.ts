import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from '../dtos/products.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Product } from '../entities/products.entity';

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
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product | null> {
    return await this.productsService.getProductById(id);
  }

  @Post('seeder')
  async precargaProducts(): Promise<Product[]> {
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: ProductDto,
  ): Promise<Product | null> {
    return await this.productsService.updateProductById(id, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProductById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.deleteProductById(id);
  }
}
