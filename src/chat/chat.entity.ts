import { Message } from 'src/message/message.entity';
import { ApiKey } from 'src/api-key/api-key.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Assistant } from 'src/assistant/assistant.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @Index()
  @Column()
  apiKeyId: number;

  @ManyToOne(() => ApiKey, (apiKey) => apiKey.chats)
  @JoinColumn({ name: 'apiKeyId' })
  apiKey: ApiKey;

  @ManyToOne(() => Assistant, (assistant) => assistant.chats)
  @JoinColumn({ name: 'assistantName' })
  assistant: Assistant;

  @Column()
  assistantName: string;
}
