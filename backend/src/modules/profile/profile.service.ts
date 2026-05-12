import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async get(): Promise<Profile> {
    const [profile] = await this.profileRepository.find({ take: 1 });
    if (profile) return profile;
    return this.profileRepository.save(this.profileRepository.create({}));
  }

  async update(data: UpdateProfileDto): Promise<Profile> {
    const profile = await this.get();
    Object.assign(profile, data);
    return this.profileRepository.save(profile);
  }
}
