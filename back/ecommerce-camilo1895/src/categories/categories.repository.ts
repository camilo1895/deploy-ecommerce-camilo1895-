import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async getCategories(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { id },
    });
  }

  async categoriesName(categoryName: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
  }

  async addCategories(category: string) {
    return await this.categoryRepository.save({
      name: category,
    });
  }
}
