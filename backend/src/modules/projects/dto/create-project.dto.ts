import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Technology } from '../../technologies/technology.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  short_description?: string;

  @IsString()
  @IsOptional()
  long_description?: string;

  @IsString()
  @IsOptional()
  cover_image_url?: string;

  @IsString()
  @IsOptional()
  repo_url?: string;

  @IsString()
  @IsOptional()
  live_url?: string;

  @IsString()
  @IsOptional()
  start_date?: string;

  @IsString()
  @IsOptional()
  end_date?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsOptional()
  display_order?: number;

  @IsOptional()
  technologies?: Partial<Technology>[];
}
