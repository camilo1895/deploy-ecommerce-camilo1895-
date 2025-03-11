import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/categories.entity';
import * as Data from '../utils/seeders/preCarga.json';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepositoty: CategoriesRepository,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepositoty.getCategories();
  }

  async addCategories(): Promise<string> {
    for (const element of Data) {
      const validateCategory = await this.categoriesRepositoty.addCategories(
        element.category,
      );

      if (!validateCategory) {
        const createCategory = this.categoryRepo.create({
          name: element.category,
        });

        await this.categoryRepo.save(createCategory);
      }
    }

    return 'Categorias agregadas correctamente';
  }
}
