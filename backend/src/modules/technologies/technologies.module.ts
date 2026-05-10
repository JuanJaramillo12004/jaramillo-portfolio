import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './technology.entity';
import { TechnologiesService } from './technologies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  providers: [TechnologiesService],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}
