import { Body, Controller, Post } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  uploadImage(@Body() payload: UploadImageDto) {
    return this.uploadService.uploadImage(payload.image);
  }
}
