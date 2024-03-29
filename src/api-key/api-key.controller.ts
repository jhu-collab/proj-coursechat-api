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
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { ApiKey } from './api-key.entity';
import { ApiKeyRoles } from './api-key-roles.enum';
import { CreateApiKeyDTO } from './api-key-create.dto';
import { UpdateApiKeyDTO } from './api-key-update.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiKeyResponseDTO } from './api-key-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';
import { FindApiKeysQueryDTO } from './api-key-find-query.dto';
import { FindApiKeysResponseDTO } from './api-key-find-response.dto';
import { CommonApiResponses } from 'src/decorators/common-api-responses.decorator';
import { DefaultPaginationInterceptor } from 'src/interceptors/default-pagination.interceptor';

@ApiTags('API Keys')
@CommonApiResponses()
@ApiSecurity('apiKey')
@Controller('api-keys')
@UseGuards(ApiKeyGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get()
  @Roles(ApiKeyRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a list of API keys' })
  @ApiQuery({
    type: FindApiKeysQueryDTO,
  })
  @ApiOkResponseWithWrapper({
    description: 'List of API keys along with pagination details and filters',
    status: 200,
    type: FindApiKeysResponseDTO,
  })
  @UseInterceptors(DefaultPaginationInterceptor)
  async findAll(
    @Query() query: FindApiKeysQueryDTO,
  ): Promise<FindApiKeysResponseDTO> {
    const apiKeys: ApiKey[] = await this.apiKeyService.findAll(query);

    return {
      ...query,
      data: apiKeys,
    };
  }

  @Get(':apiKeyId')
  @Roles(ApiKeyRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a specific API key by ID' })
  @ApiParam({ name: 'apiKeyId', description: 'ID of the API key to retrieve' })
  @ApiOkResponseWithWrapper({
    description: 'API key details',
    status: 200,
    type: ApiKeyResponseDTO,
  })
  async findOne(
    @Param('apiKeyId') apiKeyId: string,
  ): Promise<ApiKeyResponseDTO> {
    const foundApiKey = await this.apiKeyService.findOne(apiKeyId);

    if (!foundApiKey) {
      throw new NotFoundException(`API Key with ID ${apiKeyId} not found`);
    }

    return foundApiKey;
  }

  @Post()
  @Roles(ApiKeyRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiBody({ type: CreateApiKeyDTO, description: 'API key details' })
  @ApiOkResponseWithWrapper({
    description: 'API key created successfully',
    status: 201,
    type: ApiKeyResponseDTO,
  })
  async create(
    @Body() createApiKeyDto: CreateApiKeyDTO,
  ): Promise<ApiKeyResponseDTO> {
    return this.apiKeyService.create(createApiKeyDto);
  }

  @Put(':apiKeyId')
  @Roles(ApiKeyRoles.ADMIN)
  @ApiOperation({ summary: 'Update an existing API key by ID' })
  @ApiParam({ name: 'apiKeyId', description: 'ID of the API key to update' })
  @ApiBody({
    type: UpdateApiKeyDTO,
    description: 'Updated details for the API key',
  })
  @ApiOkResponseWithWrapper({
    description: 'API key updated successfully',
    status: 200,
    type: ApiKeyResponseDTO,
  })
  async update(
    @Param('apiKeyId') apiKeyId: string,
    @Body() updateApiKeyDto: UpdateApiKeyDTO,
  ): Promise<ApiKeyResponseDTO> {
    const updatesApiKey = await this.apiKeyService.update(
      apiKeyId,
      updateApiKeyDto,
    );

    if (!updatesApiKey) {
      throw new NotFoundException(`API Key with ID ${apiKeyId} not found`);
    }

    return updatesApiKey;
  }

  @Delete(':apiKeyId')
  @Roles(ApiKeyRoles.ADMIN)
  @ApiOperation({ summary: 'Delete an API key by ID' })
  @ApiParam({ name: 'apiKeyId', description: 'ID of the API key to delete' })
  @ApiOkResponseWithWrapper({
    description: 'API key deleted successfully',
    status: 200,
  })
  async delete(
    @Param('apiKeyId') apiKeyId: string,
  ): Promise<{ statusCode: number; message: string }> {
    const deletedApiKey = await this.apiKeyService.delete(apiKeyId);

    if (!deletedApiKey) {
      throw new NotFoundException(`API Key with ID ${apiKeyId} not found`);
    }

    return {
      statusCode: 200,
      message: 'Post deleted successfully',
    };
  }
}
