import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assistant } from './assistant.entity';
import { AssistantManagerService } from 'src/ai-services/assistant-manager.service';
import { ParrotService } from 'src/ai-services/parrot.service';
import { Gpt3_5TurboService } from 'src/ai-services/gpt-3.5-turbo.service';
import { Gpt4Service } from 'src/ai-services/gpt-4.service';

@Module({
  imports: [TypeOrmModule.forFeature([Assistant])],
  providers: [
    AssistantService,
    AssistantManagerService,
    ParrotService,
    Gpt3_5TurboService,
    Gpt4Service,
  ],
  controllers: [AssistantController],
  exports: [AssistantManagerService],
})
export class AssistantModule {}
