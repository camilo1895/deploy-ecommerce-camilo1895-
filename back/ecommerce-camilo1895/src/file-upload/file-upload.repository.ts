import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadRepository {
  fileUpload(idProduct: string) {
    throw new Error('Method not implemented.');
  }
}
