import {
BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';

import type { Response } from 'express';
import type { ChatCompletionChunk } from 'openai/resources';
import type { Stream } from 'openai/streaming';

import { GptService } from './gpt.service';
import {
ImageVariationDto,
  OrthographyDto,
  ProsConsEvaluatorDto,
  SpeechToTextDto,
  TextToSpeechDto,
} from './dtos';
import { TranslateDto } from './dtos/translate.dto';
import { CustomFileInterceptor } from '../interceptors/';
import { CustomAudioUpload } from '../decorators/';
import { ImageGenerationDto } from './dtos/image-generation.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-evaluator')
  prosConsEvaluator(@Body() proConEvaluator: ProsConsEvaluatorDto) {
    return this.gptService.prosConsEvaluator(proConEvaluator);
  }

  @Post('pros-cons-evaluator-stream')
  async prosConsEvaluatorStream(
    @Body() proConEvaluator: ProsConsEvaluatorDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsEvaluatorStream(proConEvaluator);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0]?.delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  async translateText(
    @Body() translateDto: TranslateDto,
    @Res() res: Response,
  ) {
    if (!translateDto.stream) {
      const result = await this.gptService.translate(translateDto);
      res.status(HttpStatus.OK).json(result);
    } else {
      const stream = (await this.gptService.translate(
        translateDto,
      )) as Stream<ChatCompletionChunk>;

      res.setHeader('Content-Type', 'application/json');
      res.status(HttpStatus.OK);

      for await (const chunk of stream) {
        const piece = chunk.choices[0]?.delta.content || '';
        res.write(piece);
      }
    }
    res.end();
  }

  @Get('text-to-speech/all')
  async textToSpeechFiles() {
    return await this.gptService.textToSpeechGetAllFiles();
  }

  @Get('text-to-speech/:fileName')
  async textToSpeechGetter(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    //check that fileName ends with .mp3
    const fileExtension = fileName.split('.').at(-1)

    if(fileExtension != 'mp3'){
      throw new BadRequestException(`Invalid file extension mp3 was expected`);
    }

    const fileStream = await this.gptService.fileGetter(fileName);
    res.setHeader('Content-Type', 'audio/mp3');
    fileStream.pipe(res);
  }

  @Post('text-to-speech')
  async textToSpeech(
    @Body() textToSpeechDto: TextToSpeechDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToSpeech(textToSpeechDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.redirect(filePath);
  }

  @Post('speech-to-text')
  @UseInterceptors(CustomFileInterceptor)
  async speechToText(
    @CustomAudioUpload() file: Express.Multer.File,
    @Body() speechToTextDto: SpeechToTextDto,
  ) {
    // console.log({file})
    return await this.gptService.speechToText(file, speechToTextDto);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileName')
  async imageGetter(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
        //check that fileName ends with .png
        const fileExtension = fileName.split('.').at(-1)

        if(fileExtension != 'png'){
          throw new BadRequestException(`Invalid file extension png was expected`);
        }
    const fileStream = await this.gptService.fileGetter(fileName);
    res.setHeader('Content-Type', 'image/png')
    fileStream.pipe(res);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.generatImageVariation(imageVariationDto);
  }
}
