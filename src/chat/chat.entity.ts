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

/**
 * Entity representing a Chat.
 *
 * This entity stores information about individual chat sessions.
 * Each chat is associated with an API key and an assistant and may contain multiple messages.
 *
 * @Entity - TypeORM decorator to mark the class as a database table.
 */
@Entity('chats')
export class Chat {
  /**
   * The unique identifier of the chat, stored as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The title of the chat session.
   */
  @Column({ length: 500 })
  title: string;

  /**
   * The date and time when the chat was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the chat was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * A collection of 'Message' entities associated with this chat.
   */
  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  /**
   * The UUID of the associated API key.
   * @Index - Marks this column as indexed for faster queries.
   */
  @Index()
  @Column({ type: 'uuid' })
  apiKeyId: string;

  /**
   * The API key entity associated with this chat.
   * Establishes a many-to-one relationship between Chat and ApiKey.
   */
  @ManyToOne(() => ApiKey, (apiKey) => apiKey.chats)
  @JoinColumn({ name: 'apiKeyId' })
  apiKey: ApiKey;

  /**
   * The assistant entity associated with this chat.
   * Establishes a many-to-one relationship between Chat and Assistant.
   */
  @ManyToOne(() => Assistant, (assistant) => assistant.chats)
  @JoinColumn({ name: 'assistantName' })
  assistant: Assistant;

  /**
   * The name of the assistant associated with this chat.
   */
  @Column()
  assistantName: string;

  /**
   * An optional username associated with the chat.
   * This field can be used to link chats to specific users in external applications.
   * Indexed for faster queries, but not required, so it can be null.
   * @Index - Marks this column as indexed for faster queries.
   */
  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string | null;

  /**
   * Optional metadata associated with the chat.
   * This field can store any additional information about the chat session.
   */
  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;
}
