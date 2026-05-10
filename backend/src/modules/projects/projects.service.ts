import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  findAll() {
    return this.projectRepository.find({ relations: ['technologies'] });
  }

  findOne(id: string) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });
  }

  create(data: CreateProjectDto) {
    const project = this.projectRepository.create(data);
    return this.projectRepository.save(project);
  }

  async update(id: string, data: UpdateProjectDto) {
    const project = await this.projectRepository.preload({
      id,
      ...data,
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return this.projectRepository.save(project);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return this.projectRepository.remove(project);
  }
}
