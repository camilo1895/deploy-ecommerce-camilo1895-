import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from '../file-upload/file-upload.repository';
import { FileUploadProvider } from './file-upload.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    private readonly fileUploadProvider: FileUploadProvider,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async uploadProductImg(id: string, file: Express.Multer.File) {
    const existingProduct = await this.fileUploadRepository.uploadImage(id);

    if (!existingProduct) {
      throw new NotFoundException('Producto no existe');
    }

    const imgUrlCloudinary =
      await this.fileUploadProvider.uploadImgCloudinary(file);

    existingProduct.imgUrl = imgUrlCloudinary;

    await this.productRepository.update(id, {
      imgUrl: existingProduct.imgUrl,
    });

    return `URL de la imagen actualizada ${imgUrlCloudinary}`;
  }
}
