import { Model } from 'mongoose';
import { Prompt } from '../schemas/prompt.schema';

export declare class PromptsService {
  constructor(promptModel: Model<Prompt>);
  create(text: string, sessionId?: string): Promise<Prompt>;
  findAll(): Promise<Prompt[]>;
  findBySession(sessionId: string): Promise<Prompt[]>;
  findOne(id: string): Promise<Prompt | null>;
  update(id: string, updatePromptDto: any): Promise<Prompt | null>;
  remove(id: string): Promise<Prompt | null>;
  generateSections(prompt: string): Promise<{ title: string; content: string }[]>;
}
