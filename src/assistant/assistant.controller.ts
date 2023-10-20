import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AppRoles } from 'src/api-key/api-key.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { AssistantResponseDTO } from './dto/assistant-response.dto';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';
import { ErrorResponseDTO } from 'src/dto/error-response.dto';

@ApiTags('Assistants')
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
@Controller('assistants')
@UseGuards(ApiKeyGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  @ApiOperation({ summary: 'Retrieve a list of assistants' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search filter for assistants',
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
    description: 'Include soft-deleted assistants',
  })
  @ApiOkResponseWithWrapper({
    description: 'List of assistants',
    status: 200,
    type: AssistantResponseDTO,
    isArray: true,
  })
  async findAll(
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('withDeleted', new ParseBoolPipe({ optional: true }))
    withDeleted?: boolean,
  ): Promise<AssistantResponseDTO[]> {
    return this.assistantService.findAll(search, limit, offset, withDeleted);
  }

  @Get(':name')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  @ApiOperation({ summary: 'Retrieve a specific assistant by name' })
  @ApiOkResponseWithWrapper({
    description: 'Assistant details',
    status: 200,
    type: AssistantResponseDTO,
  })
  async findOne(@Param('name') name: string): Promise<AssistantResponseDTO> {
    return this.assistantService.findOne(name);
  }
}
