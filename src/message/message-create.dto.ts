import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { MessageRoles } from './message-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for creating a new message.
 *
 * This DTO defines the structure and validation rules for the data used to create a new message.
 * It includes fields for the message's content and its role.
 */
export class CreateMessageDTO {
  /**
   * The content of the message. This is a required field.
   * It must be a non-empty string and represents the actual text of the message.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   * @IsNotEmpty - Ensures the content is not an empty string.
   * @IsString - Validates that the content is a string.
   */
  @ApiProperty({ description: 'Content of the message' })
  @IsNotEmpty()
  @IsString()
  content: string;

  /**
   * The role of the message, determining its source or purpose.
   * This is a required field and must be one of the predefined roles in MessageRoles.
   *
   * @ApiProperty - Documents this property in Swagger, indicating the available roles.
   * @IsNotEmpty - Ensures the role is not an empty value.
   * @IsEnum(MessageRoles) - Validates that the role is one of the specified values in MessageRoles.
   */
  @ApiProperty({ description: 'Role of the message', enum: MessageRoles })
  @IsNotEmpty()
  @IsEnum(MessageRoles)
  role: MessageRoles;
}
