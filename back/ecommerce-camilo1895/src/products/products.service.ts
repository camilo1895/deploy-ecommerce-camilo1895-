import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductDto } from 'src/dtos/products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(page: number, limit: number) {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductById(id: number) {
    const findProduct = this.productsRepository.getProductById(id);

    if (!findProduct) {
      return 'Producto no existe';
    }

    return findProduct;
  }

  createProduct(product: ProductDto) {
    return this.productsRepository.createProduct(product);
  }

  updateProductById(id: number, product: ProductDto) {
    const index = this.productsRepository.updateProductById(id);

    if (index === -1) {
      return 'Producto no existe';
    }

    return (this.productsRepository.products[index] = {
      ...this.productsRepository.products[index],
      ...product,
    });
  }

  deleteProductById(id: number) {
    const index = this.productsRepository.deleteProductById(id);

    if (index && index === -1) {
      return 'Producto no existe';
    }

    return this.productsRepository.products.splice(index, 1);
  }
}
