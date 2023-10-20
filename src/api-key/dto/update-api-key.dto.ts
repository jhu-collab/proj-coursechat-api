import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsBoolean } from 'class-validator';

export class UpdateApiKeyDTO {
  @ApiProperty({
    description: 'A description for the API key.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @ApiProperty({
    description: 'Indicates if the API key is active.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
