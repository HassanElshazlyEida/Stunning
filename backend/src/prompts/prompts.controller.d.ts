import { Prompt } from '../schemas/prompt.schema';

export declare class PromptsController {
  constructor(promptsService: any);
  generate(body: { text: string; sessionId?: string }): Promise<Prompt>;
  getHistory(): Promise<Prompt[]>;
  getBySession(sessionId: string): Promise<Prompt[]>;
  findOne(id: string): Promise<Prompt>;
  update(id: string, updatePromptDto: any): Promise<Prompt>;
  remove(id: string): Promise<Prompt>;
}
    