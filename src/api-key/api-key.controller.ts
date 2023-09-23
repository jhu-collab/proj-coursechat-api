import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKey } from './api-key.entity';
import { CreateApiKeyDTO } from './dto/create-api-key.dto';
import { UpdateApiKeyDTO } from './dto/update-api-key.dto';
import { UpdateApiKeyPartialDTO } from './dto/update-api-key-partial.dto';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<ApiKey[]> {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedOffset = offset ? Number(offset) : undefined;
    return await this.apiKeyService.findAll(search, parsedLimit, parsedOffset);
  }

  @Get(':apiKeyId')
  async findOne(@Param('apiKeyId') apiKeyId: string): Promise<ApiKey> {
    return this.apiKeyService.findOne(Number(apiKeyId));
  }

  @Post()
  async create(@Body() createApiKeyDto: CreateApiKeyDTO): Promise<ApiKey> {
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Put(':apiKeyId')
  async update(
    @Param('apiKeyId') apiKeyId: string,
    @Body() updateApiKeyDto: UpdateApiKeyDTO,
  ): Promise<ApiKey> {
    return this.apiKeyService.update(Number(apiKeyId), updateApiKeyDto);
  }

  @Patch(':apiKeyId')
  async updatePartial(
    @Param('apiKeyId') apiKeyId: string,
    @Body() updateApiKeyPartialDto: UpdateApiKeyPartialDTO,
  ): Promise<ApiKey> {
    return this.apiKeyService.updatePartial(
      Number(apiKeyId),
      updateApiKeyPartialDto,
    );
  }

  @Delete(':apiKeyId')
  async delete(@Param('apiKeyId') apiKeyId: string): Promise<void> {
    return this.apiKeyService.delete(Number(apiKeyId));
  }
}
