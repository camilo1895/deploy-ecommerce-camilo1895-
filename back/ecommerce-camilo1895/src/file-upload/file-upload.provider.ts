import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary'; //import { UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class FileUploadProvider {
  async uploadImgCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary Error: ${JSON.stringify(error)}`));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed: No result returned'));
          }
        },
      );
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}
