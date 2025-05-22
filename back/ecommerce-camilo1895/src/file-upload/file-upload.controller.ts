import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Product } from '../entities/products.entity';
import { Express } from 'express';


@ApiTags('File')
@Controller('file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiOperation({
    summary: 'Sube una imagen para un producto',
    description:
      'Endpoint para cargar una imagen asociada a un producto específico. Formatos permitidos: JPG, JPEG, PNG, WEBP. Tamaño máximo: 200KB',
  })
  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 204800,
            message: 'El archivo no debe ser menor a 200kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/i, // La "i" hace que la expresión regular sea insensible a mayúsculas/minúsculas
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id') idProduct: string,
  ): Promise<Product> {
    return await this.fileUploadService.uploadFile(file, idProduct);
  }
}
