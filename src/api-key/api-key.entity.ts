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

/**
 * Entity representing an API key.
 *
 * This entity stores information about API keys used for accessing the application.
 * Each API key can be associated with multiple chats and has a specific role.
 *
 * @Entity - Indicates that this is a TypeORM entity linked to the 'api_keys' table.
 */
@Entity('api_keys')
export class ApiKey {
  /**
   * The unique identifier of the API key.
   *
   * @PrimaryGeneratedColumn - Indicates that this column is a primary key and is auto-generated.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * A textual description of the API key's purpose or other details.
   *
   * @Column - Indicates a regular column in the table. Nullable.
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * The creation date of the API key.
   *
   * @CreateDateColumn - Indicates that this column automatically stores the date when the API key is created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The last update date of the API key.
   *
   * @UpdateDateColumn - Automatically updates with the date when the API key is modified.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Indicates whether the API key is active or has been deactivated.
   *
   * @Column - Boolean column, defaults to 'true'.
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * The soft deletion date of the API key.
   *
   * @Exclude - Excludes this field from class-to-plain transformation (e.g., when sending responses).
   * @DeleteDateColumn - Used for TypeORM's soft delete feature, storing the deletion date.
   */
  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  /**
   * Chats associated with this API key.
   *
   * @OneToMany - Indicates a one-to-many relationship with the Chat entity.
   */
  @OneToMany(() => Chat, (chat) => chat.apiKey)
  chats: Chat[];

  /**
   * The role associated with the API key, determining its level of access.
   *
   * @Column - Enum column storing the role of the API key. Defaults to 'client'.
   */
  @Column({ type: 'enum', enum: ApiKeyRoles, default: ApiKeyRoles.CLIENT })
  role: ApiKeyRoles;
}
