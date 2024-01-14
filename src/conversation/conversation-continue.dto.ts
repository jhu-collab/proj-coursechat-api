import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { booleanStringTransform } from 'src/utils/transform.utils';

/**
 * Data Transfer Object (DTO) for continuing an existing conversation.
 *
 * This DTO defines the structure and validation rules for the data required to send a follow-up message
 * in an ongoing conversation. It primarily consists of the content of the message to be sent.
 */
export class ContinueConversationDTO {
  /**
   * The content of the message to be sent in the conversation.
   * This is a required field and must be a non-empty string.
   * It represents the textual content of the user's message or query.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the conversation.
   * @IsNotEmpty - Ensures the message content is not an empty string.
   * @IsString - Validates that the message content is a string.
   */
  @ApiProperty({ description: 'Content of the message.' })
  @IsNotEmpty()
  @IsString()
  message: string;

  /**
   * A flag indicating whether the response should be streamed.
   * When set to true, the response from the assistant will be streamed back to the client.
   * Defaults to true, enabling streaming behavior.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role and default behavior.
   * @IsBoolean - Validates that the input is a boolean value.
   * @Transform - Custom transform function to convert string input to boolean.
   */
  @ApiProperty({
    description: 'Flag to stream the response.',
    default: true,
  })
  @IsBoolean()
  @Transform(({ obj }) => booleanStringTransform(obj, 'stream'))
  stream: boolean = true;
}
