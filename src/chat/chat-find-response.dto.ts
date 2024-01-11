import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatResponseDTO } from './chat-response.dto';
import { FindResponseDTO } from 'src/dto/find-response.dto';

/**
 * Data Transfer Object (DTO) for the response of querying chat data.
 *
 * This DTO extends FindResponseDTO to include specific data and filters used in chat queries.
 * It represents the structure of the response sent back to the client when querying chats,
 * including any applied filters such as `apiKeyId` and `assistantName`.
 */
export class FindChatsResponseDTO extends FindResponseDTO {
  /**
   * Optional filter that was used in the query to search for chats associated with a specific API key ID.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Filter by specific API key ID' })
  apiKeyId?: string;

  /**
   * Optional filter that was used in the query to search for chats handled by a specific assistant, identified by name.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Filter by specific assistant name' })
  assistantName?: string;

  /**
   * Optional filter that was used in the query to search for chats associated with a specific username.
   * When this filter is applied, the response will include only the chats linked to the specified username.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Filter by specific username' })
  username?: string;

  /**
   * The actual data of the response, consisting of an array of chat details.
   * Each element in the array is an instance of ChatResponseDTO.
   *
   * @ApiProperty - Documents this property in Swagger, indicating the type and structure.
   */
  @ApiProperty({
    description: 'List of chats',
    type: ChatResponseDTO,
    isArray: true,
  })
  data: ChatResponseDTO[];
}
