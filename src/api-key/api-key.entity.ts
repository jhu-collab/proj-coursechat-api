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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  apiKeyValue: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @DeleteDateColumn()
  deletedAt?: Date; // soft delete

  @OneToMany(() => Chat, (chat) => chat.apiKey)
  chats: Chat[];

  @Column({ type: 'enum', enum: AppRoles, default: AppRoles.CLIENT })
  role: AppRoles;
}
