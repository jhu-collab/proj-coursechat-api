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
import { AssistantService } from './assistant.service';
import { Assistant } from './assistant.entity';
import { CreateAssistantDTO } from './assistant-create.dto';
import { UpdateAssistantDTO } from './assistant-update.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AssistantResponseDTO } from './assistant-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';
import { FindAssistantsQueryDTO } from './assistant-find-query.dto';
import { FindAssistantsResponseDTO } from './assistant-find-response.dto';
import { AppRoles } from 'src/api-key/api-key.entity';
import { CommonApiResponses } from 'src/decorators/common-api-responses.decorator';

@ApiTags('Assistants')
@CommonApiResponses()
@ApiSecurity('apiKey')
@Controller('assistants')
@UseGuards(ApiKeyGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a list of assistants' })
  @ApiQuery({
    type: FindAssistantsQueryDTO,
  })
  @ApiOkResponseWithWrapper({
    description: 'List of assistants along with pagination details and filters',
    status: 200,
    type: FindAssistantsResponseDTO,
  })
  async findAll(
    @Query() query: FindAssistantsQueryDTO,
  ): Promise<FindAssistantsResponseDTO> {
    const assistants: Assistant[] = await this.assistantService.findAll(query);

    return {
      ...query,
      data: assistants,
    };
  }

  @Get(':name')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a specific assistant by name' })
  @ApiParam({ name: 'name', description: 'Name of the assistant to retrieve' })
  @ApiOkResponseWithWrapper({
    description: 'Assistant details',
    status: 200,
    type: AssistantResponseDTO,
  })
  async findOne(@Param('name') name: string): Promise<AssistantResponseDTO> {
    const foundAssistant = await this.assistantService.findOne(name);

    if (!foundAssistant) {
      throw new NotFoundException(`Assistant with name ${name} not found`);
    }

    return foundAssistant;
  }

  @Post()
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new assistant' })
  @ApiBody({ type: CreateAssistantDTO, description: 'Assistant details' })
  @ApiOkResponseWithWrapper({
    description: 'Assistant created successfully',
    status: 201,
    type: AssistantResponseDTO,
  })
  async create(
    @Body() createAssistantDto: CreateAssistantDTO,
  ): Promise<AssistantResponseDTO> {
    return this.assistantService.create(createAssistantDto);
  }

  @Put(':name')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Update an existing assistant by name' })
  @ApiParam({ name: 'name', description: 'Name of the assistant to update' })
  @ApiBody({
    type: UpdateAssistantDTO,
    description: 'Updated details for the assistant',
  })
  @ApiOkResponseWithWrapper({
    description: 'Assistant updated successfully',
    status: 200,
    type: AssistantResponseDTO,
  })
  async update(
    @Param('name') name: string,
    @Body() updateAssistantDto: UpdateAssistantDTO,
  ): Promise<AssistantResponseDTO> {
    const updatedAssistant = await this.assistantService.update(
      name,
      updateAssistantDto,
    );

    if (!updatedAssistant) {
      throw new NotFoundException(`Assistant with name ${name} not found`);
    }

    return updatedAssistant;
  }

  @Delete(':name')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Delete an assistant by name' })
  @ApiParam({ name: 'name', description: 'Name of the assistant to delete' })
  @ApiOkResponseWithWrapper({
    description: 'Assistant deleted successfully',
    status: 200,
  })
  async delete(
    @Param('name') name: string,
  ): Promise<{ statusCode: number; message: string }> {
    const deletedAssistant = await this.assistantService.delete(name);

    if (!deletedAssistant) {
      throw new NotFoundException(`Assistant with name ${name} not found`);
    }

    return {
      statusCode: 200,
      message: 'Assistant deleted successfully',
    };
  }
}
