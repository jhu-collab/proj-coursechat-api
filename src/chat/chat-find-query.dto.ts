import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { FindQueryDTO } from 'src/dto/find-query.dto';

export class FindChatsQueryDTO extends FindQueryDTO {
  @ApiPropertyOptional({ description: 'Filter by specific API key ID' })
  @IsUUID()
  @IsOptional()
  apiKeyId?: string;

  @ApiPropertyOptional({ description: 'Filter by specific assistant name' })
  @IsString()
  @IsOptional()
  assistantName?: string;
}
