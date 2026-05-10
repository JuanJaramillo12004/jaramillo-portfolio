import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Technology } from '../../technologies/technology.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

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
