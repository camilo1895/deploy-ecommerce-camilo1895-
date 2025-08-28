import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Product } from '../entities/products.entity';
import { Express } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('File')
@ApiBearerAuth() // Indica que el endpoint requiere autenticación JWT
@Controller('file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiOperation({
    summary: 'Sube una imagen para un producto',
    description:
      'Endpoint para cargar una imagen asociada a un producto específico. Formatos permitidos: JPG, JPEG, PNG, WEBP. Tamaño máximo: 200KB',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto al que se asociará la imagen',
    type: String,
    example: '574b552f-eac7-4ab1-93c2-7af1970c6f98',
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen subida correctamente',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description:
      'Error en la validación del archivo (tamaño o tipo incorrecto)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen a subir',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, JPEG, PNG, WEBP)',
        },
      },
    },
  })
  @Post('uploadImage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 204800,
            message: 'El archivo no debe ser mayor a 200kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/i,
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
