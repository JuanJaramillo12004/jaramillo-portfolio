import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity('technologies')
export class Technology {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon?: string;

  @ManyToMany(() => Project, (project) => project.technologies)
  projects!: Project[];
}
