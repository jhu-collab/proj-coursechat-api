import { plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsEnum,
  validateSync,
  IsBoolean,
} from 'class-validator';
import { Environment } from './env.enum';

class EnvironmentVariables {
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  OPENAI_API_KEY: string;

  @IsBoolean()
  LANGCHAIN_TRACING_V2: boolean;

  @IsString()
  LANGCHAIN_ENDPOINT: string;

  @IsString()
  LANGCHAIN_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
