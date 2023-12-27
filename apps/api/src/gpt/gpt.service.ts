import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import {
  orthographyCheckUseCase,
  prosConsEvaluatorUseCase,
  prosConsEvaluatorStreamUseCase,
  translateUseCase,
} from './use-cases';
import { OrthographyDto, ProsConsEvaluatorDto, TranslateDto } from './dtos';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  //? It will only call use cases
  async orthographyCheck({ prompt }: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt,
    });
  }

  async prosConsEvaluator({ prompt }: ProsConsEvaluatorDto) {
    return await prosConsEvaluatorUseCase(this.openai, { prompt });
  }

  async prosConsEvaluatorStream({ prompt }: ProsConsEvaluatorDto) {
    return await prosConsEvaluatorStreamUseCase(this.openai, { prompt });
  }

  async translate({ prompt, language, stream = false }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, language, stream});
  }
}
