import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { FindQueryDTO } from 'src/dto/find-query.dto';

/**
 * Data Transfer Object (DTO) for querying chat data with additional filter options.
 *
 * This DTO extends the basic FindQueryDTO to include specific filters relevant to searching for chats,
 * such as filtering by a specific API key ID or an assistant's name.
 */
export class FindChatsQueryDTO extends FindQueryDTO {
  /**
   * Optional filter to search for chats associated with a specific API key ID.
   * When provided, the query will return chats linked to the specified API key.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsUUID - Validates that the input is a valid UUID format.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({ description: 'Filter by specific API key ID' })
  @IsUUID()
  @IsOptional()
  apiKeyId?: string;

  /**
   * Optional filter to search for chats handled by a specific assistant, identified by name.
   * When provided, the query will return chats linked to the specified assistant.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsString - Validates that the input is a string.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({ description: 'Filter by specific assistant name' })
  @IsString()
  @IsOptional()
  assistantName?: string;

  /**
   * Optional filter to search for chats associated with a specific username.
   * When provided, the query will return chats linked to the specified username.
   * This can be particularly useful for external applications to retrieve chats relevant to a specific user.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsString - Validates that the input, if provided, is a string.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({ description: 'Filter by specific username' })
  @IsString()
  @IsOptional()
  username?: string;
}
