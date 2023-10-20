import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkResponseWithWrapper } from './decorators/api-ok-response-wrapper.decorator';

const logger = new Logger('AppController');

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health Check',
  })
  @ApiOkResponseWithWrapper({
    status: 200,
    description: 'API is up and running',
  })
  getHello(): string {
    logger.log('Hello world!');
    return this.appService.getHello();
  }
}
