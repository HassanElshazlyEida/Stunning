import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('Prompts (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    connection = moduleFixture.get<Connection>(getConnectionToken());
    
    await app.init();
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await connection.db.dropDatabase();
  });

  describe('/api/prompts/generate (POST)', () => {
    it('should generate sections for a prompt', () => {
      const createPromptDto = {
        text: 'Create a modern bakery website',
        sessionId: 'test-session-123',
      };

      return request(app.getHttpServer())
        .post('/api/prompts/generate')
        .send(createPromptDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.text).toBe(createPromptDto.text);
          expect(res.body.sessionId).toBe(createPromptDto.sessionId);
          expect(res.body.sections).toHaveLength(3);
          expect(res.body.isActive).toBe(true);
          expect(res.body.sections[0]).toHaveProperty('title');
          expect(res.body.sections[0]).toHaveProperty('content');
        });
    });

    it('should return 400 for invalid prompt data', () => {
      const invalidPromptDto = {
        text: '', // Empty text should be invalid
        sessionId: 'test-session',
      };

      return request(app.getHttpServer())
        .post('/api/prompts/generate')
        .send(invalidPromptDto)
        .expect(400);
    });

    it('should deactivate previous prompts in the same session', async () => {
      const sessionId = 'test-session-123';
      
      // Create first prompt
      const firstPrompt = {
        text: 'Create a bakery website',
        sessionId,
      };

      await request(app.getHttpServer())
        .post('/api/prompts/generate')
        .send(firstPrompt)
        .expect(201);

      // Create second prompt
      const secondPrompt = {
        text: 'Create a restaurant website',
        sessionId,
      };

      await request(app.getHttpServer())
        .post('/api/prompts/generate')
        .send(secondPrompt)
        .expect(201);

      // Check that only the second prompt is active
      const response = await request(app.getHttpServer())
        .get(`/api/prompts/history?sessionId=${sessionId}`)
        .expect(200);

      const activePrompts = response.body.filter(p => p.isActive);
      expect(activePrompts).toHaveLength(1);
      expect(activePrompts[0].text).toBe(secondPrompt.text);
    });
  });

  describe('/api/prompts/history (GET)', () => {
    it('should return prompt history for a session', async () => {
      const sessionId = 'test-session-123';
      
      // Create some prompts
      const prompts = [
        { text: 'Create a bakery website', sessionId },
        { text: 'Build a portfolio site', sessionId },
      ];

      for (const prompt of prompts) {
        await request(app.getHttpServer())
          .post('/api/prompts/generate')
          .send(prompt)
          .expect(201);
      }

      return request(app.getHttpServer())
        .get(`/api/prompts/history?sessionId=${sessionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('_id');
          expect(res.body[0]).toHaveProperty('text');
          expect(res.body[0]).toHaveProperty('createdAt');
          expect(res.body[0]).toHaveProperty('isActive');
        });
    });

    it('should return empty array for session with no prompts', () => {
      return request(app.getHttpServer())
        .get('/api/prompts/history?sessionId=empty-session')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('should return 400 when sessionId is missing', () => {
      return request(app.getHttpServer())
        .get('/api/prompts/history')
        .expect(400);
    });
  });

  describe('/api/prompts/:id (GET)', () => {
    it('should return a specific prompt by ID', async () => {
      // Create a prompt first
      const createResponse = await request(app.getHttpServer())
        .post('/api/prompts/generate')
        .send({
          text: 'Create a bakery website',
          sessionId: 'test-session',
        })
        .expect(201);

      const promptId = createResponse.body._id;

      return request(app.getHttpServer())
        .get(`/api/prompts/${promptId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(promptId);
          expect(res.body.text).toBe('Create a bakery website');
          expect(res.body.sections).toHaveLength(3);
        });
    });

    it('should return 404 for non-existent prompt ID', () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

      return request(app.getHttpServer())
        .get(`/api/prompts/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid prompt ID format', () => {
      return request(app.getHttpServer())
        .get('/api/prompts/invalid-id')
        .expect(400);
    });
  });

  describe('/api/prompts/:id (DELETE)', () => {
    it('should delete a prompt successfully', async () => {
      // Create a prompt first
      const createResponse = await request(app.getHttpServer())
        .post('/api/prompts/generate')
        .send({
          text: 'Create a bakery website',
          sessionId: 'test-session',
        })
        .expect(201);

      const promptId = createResponse.body._id;

      return request(app.getHttpServer())
        .delete(`/api/prompts/${promptId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.deleted).toBe(true);
        });
    });

    it('should return 404 when trying to delete non-existent prompt', () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      return request(app.getHttpServer())
        .delete(`/api/prompts/${nonExistentId}`)
        .expect(404);
    });

    it('should return 400 for invalid prompt ID format', () => {
      return request(app.getHttpServer())
        .delete('/api/prompts/invalid-id')
        .expect(400);
    });
  });

  describe('/api/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });
});
