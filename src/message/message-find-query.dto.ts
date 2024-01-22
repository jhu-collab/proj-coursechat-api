import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { MessageRoles } from './message-roles.enum';
import { FindQueryDTO } from 'src/dto/find-query.dto';

/**
 * Data Transfer Object (DTO) for querying message data with additional filter options.
 *
 * This DTO extends the basic FindQueryDTO to include specific filters relevant to searching for messages,
 * such as filtering by message role or a specific chat ID.
 */
export class FindMessagesQueryDTO extends FindQueryDTO {
  /**
   * Optional filter to search for messages based on their role.
   * When provided, the query will return messages that match the specified role.
   * The role must be one of the predefined roles in MessageRoles.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsEnum(MessageRoles) - Validates that the role is one of the specified values in MessageRoles.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({
    description: 'Filter by message role',
    enum: MessageRoles,
  })
  @IsEnum(MessageRoles)
  @IsOptional()
  role?: MessageRoles;

  /**
   * Optional filter to search for messages associated with a specific chat ID.
   * When provided, the query will return messages linked to the specified chat.
   * The chat ID must be a valid UUID.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsUUID - Validates that the chat ID is a valid UUID.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({ description: 'Filter by specific chat ID' })
  @IsUUID()
  @IsOptional()
  chatId?: string;
}
