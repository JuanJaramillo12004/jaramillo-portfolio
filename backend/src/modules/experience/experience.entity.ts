import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  role!: string;

  @Column()
  organization!: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date', nullable: true })
  start_date?: string;

  @Column({ type: 'date', nullable: true })
  end_date?: string;

  @Column({ default: false })
  is_current!: boolean;

  @Column({ default: 0 })
  display_order!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
