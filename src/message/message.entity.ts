import { Chat } from 'src/chat/chat.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
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
  timestamp: Date;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatId' }) // This specifies the column name for the foreign key
  chat: Chat;

  @Column()
  chatId: number;
}
