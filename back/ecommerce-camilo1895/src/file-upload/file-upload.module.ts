import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryConfig } from '../config/cloudinary';
import { Product } from '../entities/products.entity';
import { FileUploadController } from '../file-upload/file-upload.controller';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileUploadRepository } from '../file-upload/file-upload.repository';
import { FileUploadProvider } from '../file-upload/file-upload.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [
    CloudinaryConfig,
    FileUploadService,
    FileUploadRepository,
    FileUploadProvider,
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
