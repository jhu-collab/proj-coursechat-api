import { Exclude } from 'class-transformer';
import { Chat } from 'src/chat/chat.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

export enum AppRoles {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Chat, (chat) => chat.apiKey)
  chats: Chat[];

  @Column({ type: 'enum', enum: AppRoles, default: AppRoles.CLIENT })
  role: AppRoles;
}
