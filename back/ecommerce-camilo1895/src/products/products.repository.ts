import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from '../dtos/products.dto';
import { Product } from '../entities/products.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Product[]> {
    return await this.productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        category: true,
        orderDetails: true,
      },
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id, stock: MoreThan(0) },
    });
  }

  async precargaProducts(newProduct: ProductDto): Promise<Product> {
    return await this.productRepository.save(newProduct);
  }

  async createProduct(product: ProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(product);

    return await this.productRepository.save(newProduct);
  }

  async updateProductById(
    id: string,
    product: ProductDto,
  ): Promise<Product | null> {
    await this.productRepository.update(id, { stock: product.stock });

    return await this.productRepository.findOne({
      where: { id },
    });
  }

  async updateProductImage(
    id: string,
    urlImage: string,
  ): Promise<Product | null> {
    await this.productRepository.update(id, { imgUrl: urlImage });

    return await this.productRepository.findOne({
      where: { id },
    });
  }

  async deleteProductById(id: string) {
    return await this.productRepository.delete(id);
  }
}
