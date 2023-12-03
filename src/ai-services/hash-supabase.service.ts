import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class HashSupabaseService extends BaseAssistantService {
  modelName = 'hash-supabase';
  description = `Data structures assistant which augments user prompts using relevant lecture notes stored in a supabase vector store.
  This vector store has all lecture notes stored as chunked word embeddings`;

  // Override other shared methods and properties as needed, or use the ones from BaseAssistantService.
}
