import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { Prompt } from '../schemas/prompt.schema';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post('generate')
  async generate(@Body() body: { text: string; sessionId?: string }): Promise<Prompt> {
    try {
      if (!body.text) {
        throw new HttpException('Prompt text is required', HttpStatus.BAD_REQUEST);
      }
      return await this.promptsService.create(body.text, body.sessionId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to generate prompt', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('history')
  async getHistory(): Promise<Prompt[]> {
    try {
      return this.promptsService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch prompt history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('session/:sessionId')
  async getBySession(@Param('sessionId') sessionId: string): Promise<Prompt[]> {
    try {
      return this.promptsService.findBySession(sessionId);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch prompts for session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getPrompt(@Param('id') id: string): Promise<Prompt | null> {
    try {
      const prompt = await this.promptsService.findOne(id);
      if (!prompt) {
        throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);
      }
      return prompt;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch prompt', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updatePrompt(
    @Param('id') id: string,
    @Body() body: { text: string },
  ): Promise<Prompt | null> {
    try {
      if (!body.text) {
        throw new HttpException('Prompt text is required', HttpStatus.BAD_REQUEST);
      }
      
      const updatedPrompt = await this.promptsService.update(id, body.text);
      if (!updatedPrompt) {
        throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);
      }
      
      return updatedPrompt;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update prompt', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deletePrompt(@Param('id') id: string): Promise<Prompt | null> {
    try {
      const deletedPrompt = await this.promptsService.delete(id);
      if (!deletedPrompt) {
        throw new HttpException('Prompt not found', HttpStatus.NOT_FOUND);
      }
      return deletedPrompt;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to delete prompt', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
