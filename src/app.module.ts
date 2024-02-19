import { Module } from '@nestjs/common';
import { AiController } from './ai/ai.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AiController],
})
export class AppModule {}
