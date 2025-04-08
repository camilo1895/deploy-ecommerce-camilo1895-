import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductDto } from 'src/dtos/products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts() {
    return this.productsRepository.getProducts();
  }

  getProductById(id: number) {
    return this.productsRepository.getProductById(id);
  }

  createProduct(product: ProductDto) {
    return this.productsRepository.createProduct(product);
  }

  updateProductById() {
    return this.productsRepository.updateProductById();
  }

  deleteProductById() {
    return this.productsRepository.deleteProductById();
  }
}
