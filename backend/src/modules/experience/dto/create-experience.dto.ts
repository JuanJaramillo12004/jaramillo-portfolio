import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsNotEmpty()
  organization!: string;

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
