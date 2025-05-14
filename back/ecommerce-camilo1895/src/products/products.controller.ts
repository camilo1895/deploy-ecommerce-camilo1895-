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
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from 'src/auth/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Obtiene listado de productos paginado',
    description:
      'Recupera un listado de productos con paginación. Por defecto muestra 5 productos por página',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limite') limit: number = 5,
  ): Promise<Product[]> {
    return await this.productsService.getProducts(page, limit);
  }

  @ApiOperation({
    summary: 'Obtiene un producto por ID',
    description:
      'Recupera los detalles completos de un producto específico mediante su ID UUID',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @ApiOperation({
    summary: 'Precarga datos de productos (Seeder)',
    description:
      'Endpoint para cargar datos iniciales de productos. SOLO DISPONIBLE EN DESARROLLO',
  })
  @Post('seeder')
  async precargaProducts(): Promise<Product[]> {
    return await this.productsService.precargaProducts();
  }

  @ApiOperation({
    summary: 'Crea un nuevo producto',
    description: 'Crea un nuevo producto en el catálogo.',
  })
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() product: ProductDto) {
    return await this.productsService.createProduct(product);
  }

  @ApiOperation({
    summary: 'Actualiza un producto por ID',
    description:
      'Actualiza los datos de un producto existente. Requiere autenticación y permisos de admi',
  })
  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: ProductDto,
  ): Promise<Product> {
    return await this.productsService.updateProductById(id, product);
  }

  @ApiOperation({
    summary: 'Elimina un producto por ID',
    description: 'Elimina permanentemente un producto del sistema.',
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProductById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.deleteProductById(id);
  }
}
