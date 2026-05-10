import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Technology } from '../technologies/technology.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ nullable: true })
  repoUrl?: string;

  @Column({ nullable: true })
  demoUrl?: string;

  @Column({ default: false })
  featured!: boolean;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: true })
  published!: boolean;

  @ManyToMany(() => Technology, (technology) => technology.projects, {
    cascade: true,
  })
  @JoinTable({ name: 'project_technologies' })
  technologies!: Technology[];

  @CreateDateColumn()
  createdAt!: Date;
}
