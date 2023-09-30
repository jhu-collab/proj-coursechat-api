import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { CreateAssistantDTO } from './dto/create-assistant.dto';
import { UpdateAssistantDTO } from './dto/update-assistant.dto';
import { UpdateAssistantPartialDTO } from './dto/update-assistant-partial.dto';
import { Assistant } from './assistant.entity';

@Controller('assistants')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<Assistant[]> {
    return this.assistantService.findAll(search, limit, offset);
  }

  @Get(':name')
  async findOne(@Param('name') name: string): Promise<Assistant> {
    return this.assistantService.findOne(name);
  }

  @Post()
  async create(@Body() createModelDto: CreateAssistantDTO): Promise<Assistant> {
    return this.assistantService.create(createModelDto);
  }

  @Put(':name')
  async update(
    @Param('name') name: string,
    @Body() updateModelDto: UpdateAssistantDTO,
  ): Promise<Assistant> {
    return this.assistantService.update(name, updateModelDto);
  }

  @Patch(':name')
  async updatePartial(
    @Param('name') name: string,
    @Body() updateModelPartialDto: UpdateAssistantPartialDTO,
  ): Promise<Assistant> {
    return this.assistantService.updatePartial(name, updateModelPartialDto);
  }

  @Delete(':name')
  async delete(@Param('name') name: string): Promise<void> {
    return this.assistantService.delete(name);
  }
}
