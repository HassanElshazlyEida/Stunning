import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PromptsService } from './prompts.service';
import { Prompt } from '../schemas/prompt.schema';
import { CreatePromptDto } from './dto/create-prompt.dto';

describe('PromptsService', () => {
  let service: PromptsService;
  let mockPromptModel: any;

  const mockPrompt = {
    _id: 'prompt-id',
    text: 'Create a bakery website',
    sections: [
      { title: 'Hero', content: '<div>Hero section</div>' },
      { title: 'About', content: '<div>About section</div>' },
    ],
    sessionId: 'test-session',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    // Create a proper constructor mock for the model
    const MockPromptModel = jest.fn().mockImplementation((data) => {
      return {
        ...mockPrompt,
        ...data,
        save: jest.fn().mockResolvedValue({ ...mockPrompt, ...data }),
      };
    });
    
    mockPromptModel = MockPromptModel;
    mockPromptModel.find = jest.fn();
    mockPromptModel.findById = jest.fn();
    mockPromptModel.findByIdAndDelete = jest.fn();
    mockPromptModel.findByIdAndUpdate = jest.fn();
    mockPromptModel.updateMany = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromptsService,
        {
          provide: getModelToken(Prompt.name),
          useValue: mockPromptModel,
        },
      ],
    }).compile();

    service = module.get<PromptsService>(PromptsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a prompt with sections', async () => {
      const text = 'Create a bakery website';
      const sessionId = 'test-session';
      const mockSections = [
        { title: 'Hero', content: '<div>Hero section</div>' },
        { title: 'About', content: '<div>About section</div>' },
        { title: 'Contact', content: '<div>Contact section</div>' }
      ];

      // Create a spy on the private generateSections method
      jest.spyOn(service as any, 'generateSections').mockResolvedValue(mockSections);
      
      // Expected data to be passed to the model constructor
      const expectedData = {
        text,
        sections: mockSections,
        sessionId
      };
      
      // Expected result after save
      const savedPrompt = {
        ...mockPrompt,
        ...expectedData
      };
      
      // The mock will automatically handle constructor and save

      const result = await service.create(text, sessionId);

      // Verify the model was constructed with correct data
      expect(mockPromptModel).toHaveBeenCalledWith(expect.objectContaining(expectedData));
      expect(result).toEqual(expect.objectContaining(expectedData));
    });

    it('should generate a session ID if not provided', async () => {
      const text = 'Create a restaurant website';
      const mockSections = [
        { title: 'Hero', content: '<div>Hero section</div>' },
        { title: 'About', content: '<div>About section</div>' },
        { title: 'Contact', content: '<div>Contact section</div>' }
      ];
      
      // Create a spy on the private generateSections method
      jest.spyOn(service as any, 'generateSections').mockResolvedValue(mockSections);
      
      // Use Date.now() for session ID generation
      const mockDate = new Date(2023, 0, 1);
      const mockTimestamp = mockDate.getTime();
      jest.spyOn(global.Date, 'now').mockReturnValue(mockTimestamp);
      
      const expectedSessionId = `session-${mockTimestamp}`;
      
      // Expected data to be passed to the model constructor
      const expectedData = {
        text,
        sections: mockSections,
        sessionId: expectedSessionId
      };
      
      // Expected result after save
      const savedPrompt = {
        ...mockPrompt,
        ...expectedData
      };

      const result = await service.create(text);

      // Verify the model was constructed with correct data
      expect(mockPromptModel).toHaveBeenCalledWith(expect.objectContaining({
        text,
        sections: mockSections,
        sessionId: expectedSessionId
      }));
      expect(result).toEqual(expect.objectContaining({
        text,
        sessionId: expectedSessionId
      }));
    });
  });

  describe('findAll', () => {
    it('should return all prompts', async () => {
      const mockHistory = [
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

      mockPromptModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockHistory),
        }),
      });

      const result = await service.findAll();

      expect(mockPromptModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockHistory);
    });
  });

  describe('findBySession', () => {
    it('should return prompt history for a session', async () => {
      const sessionId = 'test-session';
      const mockHistory = [
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

      mockPromptModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockHistory),
        }),
      });

      const result = await service.findBySession(sessionId);

      expect(mockPromptModel.find).toHaveBeenCalledWith({ sessionId });
      expect(result).toEqual(mockHistory);
    });

    it('should return empty array when no history exists', async () => {
      const sessionId = 'empty-session';

      mockPromptModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.findBySession(sessionId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a prompt by ID', async () => {
      const promptId = 'prompt-123';

      mockPromptModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPrompt),
      });

      const result = await service.findOne(promptId);

      expect(mockPromptModel.findById).toHaveBeenCalledWith(promptId);
      expect(result).toEqual(mockPrompt);
    });

    it('should return null for non-existent prompt', async () => {
      const promptId = 'non-existent';

      mockPromptModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne(promptId);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a prompt successfully', async () => {
      const promptId = 'prompt-to-delete';

      mockPromptModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPrompt),
      });

      const result = await service.delete(promptId);

      expect(mockPromptModel.findByIdAndDelete).toHaveBeenCalledWith(promptId);
      expect(result).toEqual(mockPrompt);
    });

    it('should return null when prompt does not exist', async () => {
      const promptId = 'non-existent';

      mockPromptModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.delete(promptId);

      expect(result).toBeNull();
    });
  });
});
