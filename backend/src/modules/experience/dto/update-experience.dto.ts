import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateExperienceDto {
  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  start_date?: string;

  @IsString()
  @IsOptional()
  end_date?: string;

  @IsBoolean()
  @IsOptional()
  is_current?: boolean;

  @IsOptional()
  display_order?: number;
}
