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
import { ApiKeyRoles } from './api-key-roles.enum';

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

  @Column({ type: 'enum', enum: ApiKeyRoles, default: ApiKeyRoles.CLIENT })
  role: ApiKeyRoles;
}
