import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadRepository {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async uploadImage(id: string): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id: id },
    });
  }
}
