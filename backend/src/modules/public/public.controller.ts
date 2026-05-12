import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { ProjectsService } from '../projects/projects.service';
import { ExperienceService } from '../experience/experience.service';

@Controller('public')
export class PublicController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly projectsService: ProjectsService,
    private readonly experienceService: ExperienceService,
  ) {}

  @Get('profile')
  getProfile() {
    return this.profileService.get();
  }

  @Get('projects')
  getProjects() {
    return this.projectsService.findAllPublished();
  }

  @Get('projects/:slug')
  getProject(@Param('slug') slug: string) {
    return this.projectsService.findPublishedBySlug(slug);
  }

  @Get('experiences')
  getExperiences() {
    return this.experienceService.findAll();
  }
}
