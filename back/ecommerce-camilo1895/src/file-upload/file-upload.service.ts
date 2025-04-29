import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Product } from '../entities/products.entity';
import { ProductsRepository } from '../products/products.repository';
import { Readable } from 'stream'; // Método recomendado

@Injectable()
export class FileUploadService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async uploadFile(
    file: Express.Multer.File,
    idProduct: string,
  ): Promise<UploadApiResponse | Product> {
    const cloudStorage: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              return reject(new Error(`Error al subir: ${error.message}`));
            }
            if (!result) {
              return reject(new Error('No response from Cloudinary'));
            }
            resolve(result);
          },
        );
        Readable.from(file.buffer).pipe(uploadStream);
      },
    );

    console.log(cloudStorage);

    const validateProduct =
      await this.productsRepository.getProductById(idProduct);

    if (!validateProduct) {
      throw new NotFoundException('Producto no existe');
    }

    let urlImage: string; // Declaración fuera del bloque condicional

    if (
      typeof cloudStorage === 'object' && // Verifica si es un objeto
      cloudStorage !== null && // Asegura que no sea null
      'secure_url' in cloudStorage && // Verifica si 'secure_url' está presente en el objeto
      typeof cloudStorage.secure_url === 'string'
    ) {
      urlImage = cloudStorage.secure_url; // Si la propiedad existe, la extrae
    } else {
      throw new NotFoundException('No se logro cargar imagen');
    }

    const updateImageProduct = await this.productsRepository.updateProductImage(
      idProduct,
      urlImage,
    );

    if (!updateImageProduct) {
      throw new NotFoundException('No se logro actuaalizar imagen');
    }

    return updateImageProduct;
  }
}
