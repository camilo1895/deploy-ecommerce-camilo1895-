import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get(':id')
  async getCategories(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.getCategories(id);
  }

  @Post('seeder')
  async addCategories() {
    return await this.categoriesService.addCategories();
  }
}
