import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKey, AppRoles } from './api-key.entity';
import { CreateApiKeyDTO } from './dto/create-api-key.dto';
import { UpdateApiKeyDTO } from './dto/update-api-key.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('api-keys')
@UseGuards(ApiKeyGuard, RolesGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get()
  @Roles(AppRoles.ADMIN)
  async findAll(
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('withDeleted', new ParseBoolPipe({ optional: true }))
    withDeleted?: boolean,
  ): Promise<ApiKey[]> {
    return await this.apiKeyService.findAll(search, limit, offset, withDeleted);
  }

  @Get(':apiKeyId')
  @Roles(AppRoles.ADMIN)
  async findOne(
    @Param('apiKeyId', new ParseIntPipe()) apiKeyId: number,
  ): Promise<ApiKey> {
    return this.apiKeyService.findOne(apiKeyId);
  }

  @Post()
  @Roles(AppRoles.ADMIN)
  async create(@Body() createApiKeyDto: CreateApiKeyDTO): Promise<ApiKey> {
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Put(':apiKeyId')
  @Roles(AppRoles.ADMIN)
  async update(
    @Param('apiKeyId', new ParseIntPipe()) apiKeyId: number,
    @Body() updateApiKeyDto: UpdateApiKeyDTO,
  ): Promise<ApiKey> {
    return this.apiKeyService.update(Number(apiKeyId), updateApiKeyDto);
  }

  @Delete(':apiKeyId')
  @Roles(AppRoles.ADMIN)
  async delete(
    @Param('apiKeyId', new ParseIntPipe()) apiKeyId: number,
  ): Promise<void> {
    return this.apiKeyService.delete(apiKeyId);
  }
}
