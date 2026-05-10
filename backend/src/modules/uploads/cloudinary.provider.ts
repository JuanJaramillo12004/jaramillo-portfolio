import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloudinary_url: configService.get<string>('cloudinary.url'),
    });
    return cloudinary;
  },
  inject: [ConfigService],
};
