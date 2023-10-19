import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { Assistant } from './assistant.entity';
import { AppRoles } from 'src/api-key/api-key.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('assistants')
@UseGuards(ApiKeyGuard, RolesGuard)
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  async findAll(
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('withDeleted', new ParseBoolPipe({ optional: true }))
    withDeleted?: boolean,
  ): Promise<Assistant[]> {
    return this.assistantService.findAll(search, limit, offset, withDeleted);
  }

  @Get(':name')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  async findOne(@Param('name') name: string): Promise<Assistant> {
    return this.assistantService.findOne(name);
  }
}
