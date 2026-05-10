import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technology } from './technology.entity';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  findAll() {
    return this.technologyRepository.find();
  }

  create(name: string, icon?: string) {
    const technology = this.technologyRepository.create({ name, icon });
    return this.technologyRepository.save(technology);
  }
}
