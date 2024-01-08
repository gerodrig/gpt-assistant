import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

import {
  orthographyCheckUseCase,
  prosConsEvaluatorUseCase,
  prosConsEvaluatorStreamUseCase,
  translateUseCase,
  textToSpeechUseCase,
imageVariationUseCase,
} from './use-cases';
import {
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsEvaluatorDto,
  TextToSpeechDto,
  TranslateDto,
} from './dtos';
import { S3Adapter } from '../adapters/s3.adapter';
import { speechToTextUseCase } from './use-cases/speech-to-text.use-case';
import { SpeechToTextDto } from './dtos/speech-to-text.dto';
import { imageGenerationUseCase } from './use-cases/image-generation.use-case';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(private readonly s3Adapter: S3Adapter) {}

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
    return await translateUseCase(this.openai, { prompt, language, stream });
  }
  async textToSpeech({ text, voice }: TextToSpeechDto) {
    const buffer = await textToSpeechUseCase(this.openai, {
      prompt: text,
      voice,
    });
    const path = await this.s3Adapter.uploadMP3(
      buffer,
      `${voice}-${Date.now()}.mp3`,
    );

    return path;
  }

  async fileGetter(fileName: string) {
    return await this.s3Adapter.getFile(fileName);
  }

  async textToSpeechGetAllFiles(): Promise<string[]> {
    return await this.s3Adapter.getAllMP3();
  }

  async speechToText(
    audioFile: Express.Multer.File,
    { prompt }: SpeechToTextDto,
  ) {
    return await speechToTextUseCase(this.openai, { audioFile, prompt });
  }

  async imageGeneration(imageGeneration: ImageGenerationDto) {
    const response = await imageGenerationUseCase(this.openai, { ...imageGeneration });

    //save to s3
    const url = await this.s3Adapter.uploadImage(response.url);

    return { ok: true, url: url, revised_prompt: response.revised_prompt };
  }

  async generatImageVariation(imageVariationDto: ImageVariationDto) {
    const response = await imageVariationUseCase(this.openai, { ...imageVariationDto });

    return { ok: true, url: response.url };

    //? save to s3
    // const url = await this.s3Adapter.uploadImage(response.url);

    // return { ok: true, url: url};
  }
}
