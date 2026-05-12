import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  findAll() {
    return this.projectRepository.find({
      relations: ['technologies'],
      order: { display_order: 'ASC' },
    });
  }

  findAllPublished() {
    return this.projectRepository.find({
      where: { status: 'published' },
      relations: ['technologies'],
      order: { display_order: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });
  }

  findBySlug(slug: string) {
    return this.projectRepository.findOne({
      where: { slug },
      relations: ['technologies'],
    });
  }

  findPublishedBySlug(slug: string) {
    return this.projectRepository.findOne({
      where: { slug, status: 'published' },
      relations: ['technologies'],
    });
  }

  create(data: CreateProjectDto) {
    if (!data.slug) {
      data.slug = slugify(data.title);
    }
    const project = this.projectRepository.create(data);
    return this.projectRepository.save(project);
  }

  async update(id: string, data: UpdateProjectDto) {
    const project = await this.projectRepository.preload({ id, ...data });
    if (!project) throw new NotFoundException('Project not found');
    return this.projectRepository.save(project);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    if (!project) throw new NotFoundException('Project not found');
    return this.projectRepository.remove(project);
  }

  async getStats() {
    const [total, published, featured] = await Promise.all([
      this.projectRepository.count(),
      this.projectRepository.count({ where: { status: 'published' } }),
      this.projectRepository.count({ where: { featured: true } }),
    ]);
    return { total, published, featured };
  }
}
