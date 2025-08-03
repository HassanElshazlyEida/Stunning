import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.config';
import { PromptsModule } from './prompts/prompts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PromptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
