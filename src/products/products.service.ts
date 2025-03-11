import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from '../entities/products.entity';
import { ProductDto } from '../dtos/products.dto';
import * as data from '../utils/seeders/preCarga.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/categories.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async getProducts(page: number, limit: number) {
    return await this.productsRepository.findAll(Number(page), Number(limit));
  }

  async addProducts() {
    for (const element of data) {
      const existingProduct = await this.productsRepository.addProducts(
        element.name,
      );

      if (!existingProduct) {
        const category = await this.categoryRepo.findOne({
          where: { name: element.category },
        });

        if (!category) {
          throw new NotFoundException(
            `Categoría ${element.category} no encontrada`,
          );
        }

        const createProduct = this.productRepo.create({
          name: element.name,
          description: element.description,
          price: element.price,
          stock: element.stock,
          category, // Pasamos el objeto completo.
        });
        await this.productRepo.save(createProduct);
      }
    }

    return 'Productos agregados correctamente';
  }

  async getById(id: string) {
    return await this.productRepo.findOne({
      where: { id },
    });
  }

  async getProductById(id: string) {
    const product = await this.productsRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async createProduct(product: ProductDto): Promise<string> {
    const validateProduct =
      await this.productsRepository.createProduct(product);

    if (!validateProduct) {
      const saveProduct = await this.productRepo.save(product);

      return saveProduct.id;
    }

    throw new NotFoundException('Producto ya existe');
  }

  async updateProduct(
    id: string,
    product: ProductDto,
  ): Promise<Product | string> {
    const consultProduct = await this.productsRepository.updateElement(id);

    if (!consultProduct) throw new NotFoundException('Producto no existe');

    if (consultProduct) {
      if (product.name) {
        consultProduct.name = product.name;
      }
      if (product.description) {
        consultProduct.description = product.description;
      }
      if (product.price || product.price >= 0) {
        consultProduct.price = product.price;
      }
      if (typeof product.stock === 'boolean') {
        consultProduct.stock = product.stock;
      }
      if (product.imgUrl) {
        consultProduct.imgUrl = product.imgUrl;
      }
    }

    return await this.productRepo.save(consultProduct);
  }

  async deleteProduct(id: string): Promise<string> {
    const product = await this.productsRepository.deletProduct(id);

    if (!product) throw new NotFoundException('Producto no existe');

    await this.productRepo.delete(id);

    return 'Usuario eleminado correctamente';
  }
}
