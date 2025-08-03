import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Set global prefix and enable CORS
  app.setGlobalPrefix('api');
  app.enableCors();
  
  // Log application startup
  logger.log(`Application is starting on port 3001`);
  logger.log('MongoDB connection will be managed by MongooseModule');
  
  // Start server
  await app.listen(3001);
  logger.log(`Application is running on: http://localhost:3001/api`);
}

bootstrap();
