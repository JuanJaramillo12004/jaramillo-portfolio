import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Technology } from '../../technologies/technology.entity';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  repoUrl?: string;

  @IsString()
  @IsOptional()
  demoUrl?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsOptional()
  technologies?: Partial<Technology>[];
}
