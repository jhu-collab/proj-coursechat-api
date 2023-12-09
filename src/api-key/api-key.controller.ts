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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { AppRoles } from './api-key.entity';
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
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { ErrorResponseDTO } from 'src/dto/error-response.dto';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';

@ApiTags('API Keys')
@ApiResponse({
  status: 400,
  description: 'Bad Request',
  type: ErrorResponseDTO,
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  type: ErrorResponseDTO,
})
@ApiResponse({ status: 404, description: 'Not Found', type: ErrorResponseDTO })
@ApiResponse({
  status: 500,
  description: 'Internal Server Error',
  type: ErrorResponseDTO,
})
@ApiSecurity('apiKey')
@Controller('api-keys')
@UseGuards(ApiKeyGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get()
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a list of API keys' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search filter for API keys',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit the number of results',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
  })
  @ApiQuery({
    name: 'withDeleted',
    required: false,
    description: 'Include soft-deleted API keys',
  })
  @ApiOkResponseWithWrapper({
    description: 'List of API keys',
    status: 200,
    type: ApiKeyResponseDTO,
    isArray: true,
  })
  async findAll(
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('withDeleted', new ParseBoolPipe({ optional: true }))
    withDeleted?: boolean,
  ): Promise<ApiKeyResponseDTO[]> {
    return this.apiKeyService.findAll(search, limit, offset, withDeleted);
  }

  @Get(':apiKeyId')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a specific API key by ID' })
  @ApiParam({ name: 'apiKeyId', description: 'ID of the API key to retrieve' })
  @ApiOkResponseWithWrapper({
    description: 'API key details',
    status: 200,
    type: ApiKeyResponseDTO,
  })
  async findOne(
    @Param('apiKeyId', new ParseIntPipe()) apiKeyId: number,
  ): Promise<ApiKeyResponseDTO> {
    return this.apiKeyService.findOne(apiKeyId);
  }

  @Post()
  @Roles(AppRoles.ADMIN)
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
  @Roles(AppRoles.ADMIN)
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
    @Param('apiKeyId', new ParseIntPipe()) apiKeyId: number,
    @Body() updateApiKeyDto: UpdateApiKeyDTO,
  ): Promise<ApiKeyResponseDTO> {
    return this.apiKeyService.update(apiKeyId, updateApiKeyDto);
  }

  @Delete(':apiKeyId')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Delete an API key by ID' })
  @ApiParam({ name: 'apiKeyId', description: 'ID of the API key to delete' })
  @ApiOkResponseWithWrapper({
    description: 'API key deleted successfully',
    status: 200,
  })
  async delete(
    @Param('apiKeyId', new ParseIntPipe()) apiKeyId: number,
  ): Promise<void> {
    return this.apiKeyService.delete(apiKeyId);
  }
}
