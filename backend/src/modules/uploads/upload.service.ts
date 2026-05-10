import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinaryClient: typeof cloudinary,
  ) {}

  async uploadImage(imageBase64: string) {
    const result = await this.cloudinaryClient.uploader.upload(imageBase64, {
      folder: 'portfolio',
      resource_type: 'image',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
