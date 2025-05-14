import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductDto } from '../dtos/products.dto';
import { Product } from '../entities/products.entity';
import data from '../../data.json';
import { CategoriesRepository } from '../categories/categories.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async getProducts(page: number, limit: number) {
    return await this.productsRepository.getProducts(page, limit);
  }

  async getProductById(id: string): Promise<Product> {
    const productById = await this.productsRepository.getProductById(id);

    if (!productById) {
      throw new NotFoundException('Producto no existe');
    }

    return productById;
  }

  async precargaProducts(): Promise<Product[]> {
    const unicos = data.filter(
      (item, index, products) =>
        index === products.findIndex((product) => product.name === item.name),
    );

    const productosCreados = await Promise.all(
      unicos.map(async (product) => {
        const categories = await this.categoriesRepository.categoriesName(
          product.category,
        );

        if (!categories) {
          throw new NotFoundException('Categoria no existe');
        }

        const newProduct = {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: { id: categories.id },
        };

        const estadoPrecarga =
          await this.productsRepository.precargaProducts(newProduct);

        if (!estadoPrecarga) {
          throw new NotFoundException('Precarga no exitosa');
        }

        return estadoPrecarga;
      }),
    );

    return productosCreados;
  }

  async createProduct(product: ProductDto) {
    return this.productsRepository.createProduct(product);
  }

  async updateProductById(id: string, product: ProductDto): Promise<Product> {
    const validateProduct = await this.productsRepository.getProductById(id);

    if (!validateProduct) {
      throw new NotFoundException('Producto no existe');
    }

    const updateProduct = await this.productsRepository.updateProductById(
      id,
      product,
    );

    if (!updateProduct) {
      throw new NotFoundException('Error al retornar producto actualizado');
    }

    return updateProduct;
  }

  async deleteProductById(id: string) {
    const validateProduct = await this.productsRepository.getProductById(id);

    if (!validateProduct) {
      throw new NotFoundException('Producto no existe');
    }

    return await this.productsRepository.deleteProductById(id);
  }
}
