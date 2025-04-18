import { Injectable } from '@nestjs/common';
import { ProductDto } from 'src/dtos/products.dto';
import { Product } from 'src/entities/products.entity';

@Injectable()
export class ProductsRepository {
  public products: Product[] = [
    {
      id: 1,
      name: 'Laptop Gamer',
      description:
        'Laptop potente con procesador i7 y tarjeta gráfica RTX 3060.',
      price: 4500000,
      stock: true,
      imgUrl: 'https://example.com/laptop.jpg',
    },
    {
      id: 2,
      name: 'Celular Samsung S23',
      description: 'Smartphone con pantalla AMOLED y cámara de 108MP.',
      price: 3500000,
      stock: true,
      imgUrl: 'https://example.com/samsung-s23.jpg',
    },
    {
      id: 3,
      name: 'Audífonos Bluetooth',
      description: 'Audífonos inalámbricos con cancelación de ruido.',
      price: 250000,
      stock: false,
      imgUrl: 'https://example.com/audifonos.jpg',
    },
    {
      id: 4,
      name: 'Teclado Mecánico RGB',
      description:
        'Teclado mecánico con switches rojos y retroiluminación RGB.',
      price: 300000,
      stock: true,
      imgUrl: 'https://example.com/teclado.jpg',
    },
  ];

  async getProducts(page: number, limit: number): Promise<Product[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return this.products.slice(startIndex, endIndex);
  }

  getProductById(id: number) {
    return this.products.find((product) => product.id === id);
  }

  async createProduct(product: ProductDto): Promise<number> {
    const idProduct = this.products.length + 1;

    return this.products.push({ id: idProduct, ...product });
  }

  updateProductById(id: number) {
    return this.products.findIndex((product) => product.id === id);
  }

  deleteProductById(id: number) {
    return this.products.findIndex((product) => product.id === id);
  }
}
