import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { ProfileModule } from '../profile/profile.module';
import { ProjectsModule } from '../projects/projects.module';
import { ExperienceModule } from '../experience/experience.module';

@Module({
  imports: [ProfileModule, ProjectsModule, ExperienceModule],
  controllers: [PublicController],
})
export class PublicModule {}
