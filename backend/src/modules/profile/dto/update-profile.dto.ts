import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  email_public?: string;

  @IsString()
  @IsOptional()
  resume_url?: string;

  @IsObject()
  @IsOptional()
  social_links?: Record<string, string>;
}
