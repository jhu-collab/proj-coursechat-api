import { Chat } from 'src/chat/chat.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['system', 'user', 'assistant', 'function'],
    default: 'user',
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column()
  chatId: number;
}
