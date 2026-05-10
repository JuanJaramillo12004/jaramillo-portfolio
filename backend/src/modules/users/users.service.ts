import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  create(user: Partial<User>) {
    return this.usersRepository.create(user);
  }

  save(user: User) {
    return this.usersRepository.save(user);
  }

  async findAll() {
    return this.usersRepository.find();
  }
}
