import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  full_name?: string;

  @Column({ nullable: true })
  headline?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  email_public?: string;

  @Column({ nullable: true })
  resume_url?: string;

  @Column({ type: 'jsonb', nullable: true })
  social_links?: Record<string, string>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
