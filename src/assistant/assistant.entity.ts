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

/**
 * Entity representing an AI Assistant.
 *
 * This entity stores information about assistants. Assistants are identified by their names
 * and can be associated with multiple chats.
 *
 * @Entity - TypeORM decorator to mark the class as a database table.
 */
@Entity('assistants')
export class Assistant {
  /**
   * The unique name of the assistant. This is the primary key of the entity.
   */
  @PrimaryColumn({ unique: true, length: 50 })
  name: string;

  /**
   * A text description of the assistant, providing additional context or information.
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * The date and time when the assistant record was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the assistant record was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * A collection of 'Chat' entities associated with this assistant.
   */
  @OneToMany(() => Chat, (chat) => chat.assistant)
  chats: Chat[];

  /**
   * A boolean flag indicating whether the assistant is active.
   * Inactive assistants should not be involved in new chats.
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * The date and time when the assistant was soft-deleted.
   * @Exclude - Class-transformer decorator to omit this field in the response.
   */
  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date; // Soft delete
}
