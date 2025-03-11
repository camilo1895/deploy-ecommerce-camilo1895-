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
import { Product } from '../entities/products.entity';
import { AuthGuard } from '../auth/auth.guard';
import { ProductDto } from '../dtos/products.dto';
import { RolesGuard } from '../users/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../users/roles.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return await this.productsService.getProducts(Number(page), Number(limit));
  }

  @Get('seeder')
  addProducts() {
    return this.productsService.addProducts();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.getProductById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post()
  async createProduct(@Body() product: ProductDto): Promise<string> {
    const { name, description, price, stock, imgUrl } = product;

    return await this.productsService.createProduct({
      name,
      description,
      price,
      stock,
      imgUrl,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: ProductDto,
  ): Promise<Product | string> {
    const { name, description, price, stock, imgUrl } = product;

    return await this.productsService.updateProduct(id, {
      name,
      description,
      price,
      stock,
      imgUrl,
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.productsService.deleteProduct(id);
  }
}
