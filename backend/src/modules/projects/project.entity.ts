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

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ default: 'draft' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  short_description?: string;

  @Column({ type: 'text', nullable: true })
  long_description?: string;

  @Column({ nullable: true })
  cover_image_url?: string;

  @Column({ nullable: true })
  repo_url?: string;

  @Column({ nullable: true })
  live_url?: string;

  @Column({ type: 'date', nullable: true })
  start_date?: string;

  @Column({ type: 'date', nullable: true })
  end_date?: string;

  @Column({ default: false })
  featured!: boolean;

  @Column({ default: 0 })
  display_order!: number;

  @ManyToMany(() => Technology, (technology) => technology.projects, {
    cascade: true,
  })
  @JoinTable({ name: 'project_technologies' })
  technologies!: Technology[];

  @CreateDateColumn()
  createdAt!: Date;
}
