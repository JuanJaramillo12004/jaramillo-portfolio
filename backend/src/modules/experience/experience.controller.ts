import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Controller('admin/experiences')
@UseGuards(JwtAuthGuard)
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateExperienceDto) {
    return this.experienceService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateExperienceDto) {
    return this.experienceService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experienceService.remove(id);
  }
}
