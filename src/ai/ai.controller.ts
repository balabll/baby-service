import { Controller, Post, HttpCode, Body, Sse } from '@nestjs/common';
import OpenAI from 'openai';
import { Observable } from 'rxjs';
import { ConversationDto } from 'src/dto/ConversationDto';
import { OPENAI_MODEL_3 } from 'src/constants';

@Controller('ai')
export class AiController {
  private openai = undefined;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });
  }

  @Post('/conversation')
  @HttpCode(200)
  @Sse()
  async conversation(@Body() payload: ConversationDto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Observable(async (subscriber) => {
      const stream = await this.openai.chat.completions.create({
        model: OPENAI_MODEL_3,
        messages: [{ role: 'user', content: payload.prompt }],
        stream: true,
      });
      for await (const part of stream) {
        if (Object.keys(part.choices[0].delta).length === 0) {
          subscriber.complete();
          return;
        }
        subscriber.next({ data: part.choices[0].delta });
      }
    });
  }
}
