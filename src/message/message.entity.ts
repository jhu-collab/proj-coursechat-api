import { Chat } from 'src/chat/chat.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { MessageRoles } from './message-roles.enum';

/**
 * Entity representing a Message.
 *
 * This entity stores information about individual messages within chat sessions.
 * Each message is associated with a chat and has a specific role, indicating whether it's from a user or another entity.
 *
 * @Entity - TypeORM decorator to mark the class as a database table.
 */
@Entity('messages')
export class Message {
  /**
   * The unique identifier of the message, stored as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The text content of the message.
   */
  @Column({ type: 'text' })
  content: string;

  /**
   * The role associated with the message, indicating the source of the message (e.g., user, system).
   */
  @Column({
    type: 'enum',
    enum: MessageRoles,
    default: MessageRoles.USER,
  })
  role: MessageRoles;

  /**
   * The date and time when the message was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the message was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * The chat entity to which this message belongs.
   * Establishes a many-to-one relationship with the Chat entity.
   * Messages are deleted if the associated chat is deleted ('CASCADE').
   */
  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  /**
   * The UUID of the chat to which this message belongs.
   * @Index - Marks this column as indexed for faster queries.
   */
  @Index()
  @Column({ type: 'uuid' })
  chatId: string;
}
