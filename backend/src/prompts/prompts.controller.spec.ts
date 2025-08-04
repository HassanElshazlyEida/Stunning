import { Test, TestingModule } from '@nestjs/testing';
import { PromptsController } from './prompts.controller';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';

describe('PromptsController', () => {
  let controller: PromptsController;
  let service: PromptsService;

  const mockPromptsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findBySession: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromptsController],
      providers: [
        {
          provide: PromptsService,
          useValue: mockPromptsService,
        },
      ],
    }).compile();

    controller = module.get<PromptsController>(PromptsController);
    service = module.get<PromptsService>(PromptsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generate', () => {
    it('should generate sections for a prompt', async () => {
      const createPromptDto = {
        text: 'Create a bakery website',
        sessionId: 'test-session-123',
      };

      const expectedResult = {
        _id: 'prompt-id',
        text: 'Create a bakery website',
        sections: [
          { title: 'Hero', content: '<div>Hero section</div>' },
          { title: 'About', content: '<div>About section</div>' },
        ],
        sessionId: 'test-session-123',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPromptsService.create.mockResolvedValue(expectedResult);

      const result = await controller.generate(createPromptDto);

      expect(service.create).toHaveBeenCalledWith(createPromptDto.text, createPromptDto.sessionId);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors during section generation', async () => {
      const createPromptDto = {
        text: 'Invalid prompt',
        sessionId: 'test-session-123',
      };

      mockPromptsService.create.mockRejectedValue(
        new Error('Generation failed'),
      );

      await expect(controller.generate(createPromptDto)).rejects.toThrow();
    });
  });

  describe('getHistory', () => {
    it('should return all prompt history', async () => {
      const expectedHistory = [
        {
          _id: 'prompt-1',
          text: 'Create a bakery website',
          isActive: false,
          createdAt: new Date(),
        },
        {
          _id: 'prompt-2',
          text: 'Build a portfolio site',
          isActive: true,
          createdAt: new Date(),
        },
      ];

      mockPromptsService.findAll.mockResolvedValue(expectedHistory);

      const result = await controller.getHistory();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedHistory);
    });

    it('should return empty array when no history exists', async () => {
      mockPromptsService.findAll.mockResolvedValue([]);

      const result = await controller.getHistory();

      expect(result).toEqual([]);
    });
  });

  describe('getBySession', () => {
    it('should return prompt history for a session', async () => {
      const sessionId = 'test-session-123';
      const expectedHistory = [
        {
          _id: 'prompt-1',
          text: 'Create a bakery website',
          isActive: false,
          createdAt: new Date(),
        },
        {
          _id: 'prompt-2',
          text: 'Build a portfolio site',
          isActive: true,
          createdAt: new Date(),
        },
      ];

      mockPromptsService.findBySession.mockResolvedValue(expectedHistory);

      const result = await controller.getBySession(sessionId);

      expect(service.findBySession).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(expectedHistory);
    });
  });

  describe('getPrompt', () => {
    it('should return a specific prompt by ID', async () => {
      const promptId = 'prompt-123';
      const expectedPrompt = {
        _id: promptId,
        text: 'Create a bakery website',
        sections: [
          { title: 'Hero', content: '<div>Hero section</div>' },
        ],
        sessionId: 'test-session',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPromptsService.findOne.mockResolvedValue(expectedPrompt);

      const result = await controller.getPrompt(promptId);

      expect(service.findOne).toHaveBeenCalledWith(promptId);
      expect(result).toEqual(expectedPrompt);
    });

    it('should handle non-existent prompt ID', async () => {
      const promptId = 'non-existent';
      mockPromptsService.findOne.mockResolvedValue(null);

      await expect(controller.getPrompt(promptId)).rejects.toThrow();
    });
  });

  describe('deletePrompt', () => {
    it('should delete a prompt successfully', async () => {
      const promptId = 'prompt-to-delete';
      const deletedPrompt = {
        _id: promptId,
        text: 'Create a bakery website',
        sections: [],
        sessionId: 'test-session',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPromptsService.delete.mockResolvedValue(deletedPrompt);

      const result = await controller.deletePrompt(promptId);

      expect(service.delete).toHaveBeenCalledWith(promptId);
      expect(result).toEqual(deletedPrompt);
    });

    it('should handle deletion of non-existent prompt', async () => {
      const promptId = 'non-existent';
      mockPromptsService.delete.mockResolvedValue(null);

      await expect(controller.deletePrompt(promptId)).rejects.toThrow();
    });
  });
});
