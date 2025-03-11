import { Injectable } from '@nestjs/common';
import { Product } from '../entities/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from '../dtos/products.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findAll(page: number, limit: number): Promise<Product[]> {
    return await this.productRepo.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category'],
    });
  }

  async addProducts(element: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { name: element },
    });
  }

  async getProductById(id: string) {
    return await this.productRepo.findOne({
      where: { id },
    });
  }

  async createProduct(product: ProductDto): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: {
        name: product.name,
      },
    });
  }

  async updateElement(id: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { id },
    });
  }

  async deletProduct(id: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { id },
    });
  }
}
