import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import data from '../../data.json';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  getCategories(id: string) {
    return this.categoriesRepository.getCategories(id);
  }

  async addCategories() {
    const unicos = data.filter(
      (item, index, products) =>
        index ===
        products.findIndex((product) => product.category === item.category),
    );

    await Promise.all(
      unicos.map(async (category) => {
        return this.categoriesRepository.addCategories(category.category);
      }),
    );
  }
}
