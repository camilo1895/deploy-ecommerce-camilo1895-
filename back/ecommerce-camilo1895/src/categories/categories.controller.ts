import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Category } from 'src/entities/categories.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Obtiene una categoría por ID',
    description:
      'Recupera los detalles de una categoría específica mediante su ID UUID',
  })
  @Get(':id')
  async getCategories(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.getCategories(id);
  }

  @ApiOperation({
    summary: 'Ejecuta seeder de categorías',
    description:
      'Endpoint administrativo para poblar la base de datos con categorías iniciales. SE USA SOLO EN DESARROLLO',
  })
  @Post('seeder')
  async addCategories(): Promise<Category[]> {
    return await this.categoriesService.addCategories();
  }
}
