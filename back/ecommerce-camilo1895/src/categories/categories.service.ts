import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import data from '../../data.json';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getCategories(id: string) {
    const validateCategories =
      await this.categoriesRepository.getCategories(id);

    if (!validateCategories) {
      throw new NotFoundException('Los datos ingresados son incorrectos');
    }

    return validateCategories;
  }

  async addCategories() {
    const unicos = data.filter(
      (item, index, products) =>
        index ===
        products.findIndex((product) => product.category === item.category),
    );

    const estadoPrecarga = await Promise.all(
      unicos.map(async (category) => {
        return this.categoriesRepository.addCategories(category.category);
      }),
    );

    if (!estadoPrecarga) {
      throw new NotFoundException('Precarga no exitosa');
    }

    return estadoPrecarga;
  }
}
