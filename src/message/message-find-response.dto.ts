import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageResponseDTO } from './message-response.dto';
import { MessageRoles } from './message-roles.enum';
import { FindResponseDTO } from 'src/dto/find-response.dto';

/**
 * Data Transfer Object (DTO) for the response of querying message data.
 *
 * This DTO extends FindResponseDTO to include specific data and filters used in message queries.
 * It represents the structure of the response sent back to the client when querying messages,
 * including any applied filters such as `chatId` and `role`.
 */
export class FindMessagesResponseDTO extends FindResponseDTO {
  /**
   * Optional filter that was used in the query to search for messages associated with a specific chat ID.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Filter by specific chat ID' })
  chatId?: string;

  /**
   * Optional filter that was used in the query to search for messages based on their role.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Filter by message role' })
  role?: MessageRoles;

  /**
   * The metadata associated with the chat.
   * This field, if provided during chat creation, includes additional information about the chat.
   * It is included in the response to provide context about the chat's contents or purpose.
   *
   * @ApiPropertyOptional - Documents this property in Swagger as optional, indicating its role and presence in the response.
   */
  @ApiPropertyOptional({ description: 'Additional metadata for the chat' })
  metadata?: Record<string, any>;

  /**
   * The actual data of the response, consisting of an array of message details.
   * Each element in the array is an instance of MessageResponseDTO.
   *
   * @ApiProperty - Documents this property in Swagger, indicating the type and structure.
   */
  @ApiProperty({
    description: 'List of messages',
    type: MessageResponseDTO,
    isArray: true,
  })
  data: MessageResponseDTO[];
}
