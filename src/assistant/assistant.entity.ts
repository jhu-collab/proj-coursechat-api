import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Chat } from 'src/chat/chat.entity';
import { Exclude } from 'class-transformer';

@Entity('assistants')
export class Assistant {
  @PrimaryColumn({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Chat, (chat) => chat.assistant)
  chats: Chat[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date; // soft delete
}
