import { Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get(':id')
  getCategories(@Param('id') id: string) {
    return this.categoriesService.getCategories(id);
  }

  @Post('seeder')
  addCategories() {
    return this.categoriesService.addCategories();
  }
}
