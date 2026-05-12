import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  findAll() {
    return this.experienceRepository.find({
      order: { display_order: 'ASC', start_date: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.experienceRepository.findOne({ where: { id } });
  }

  create(data: CreateExperienceDto) {
    const experience = this.experienceRepository.create(data);
    return this.experienceRepository.save(experience);
  }

  async update(id: string, data: UpdateExperienceDto) {
    await this.experienceRepository.update(id, data);
    const experience = await this.findOne(id);
    if (!experience) throw new NotFoundException('Experience not found');
    return experience;
  }

  async remove(id: string) {
    const experience = await this.findOne(id);
    if (!experience) throw new NotFoundException('Experience not found');
    return this.experienceRepository.remove(experience);
  }
}
