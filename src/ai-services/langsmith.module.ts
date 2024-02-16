import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dynamicImport } from 'src/ai-services/assistant.utils';

@Global()
@Module({
  imports: [ConfigModule],
})
export class LangSmithModule {
  static async forRoot() {
    const { Client } = await dynamicImport('langsmith');

    return {
      module: LangSmithModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'LANGSMITH_CLIENT',
          useFactory: (configService: ConfigService) => {
            return new Client({
              apiUrl: configService.get<string>('LANGCHAIN_ENDPOINT'),
              apiKey: configService.get<string>('LANGCHAIN_API_KEY'),
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: ['LANGSMITH_CLIENT'],
    };
  }
}
