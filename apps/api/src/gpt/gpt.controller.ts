import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import type { Response } from 'express';
import type { ChatCompletionChunk } from 'openai/resources';
import type { Stream } from 'openai/streaming';

import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsEvaluatorDto, SpeechToTextDto, TextToSpeechDto } from './dtos';
import { TranslateDto } from './dtos/translate.dto';
import { CustomFileInterceptor } from '../interceptors/';
import { CustomAudioUpload } from '../decorators/';

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

      const stream = await this.gptService.translate(translateDto) as Stream<ChatCompletionChunk>;
  
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
  async textToSpeechFiles(
  ) {
    return await this.gptService.textToSpeechGetAllFiles();
  }

  @Get('text-to-speech/:fileId')
  async textToSpeechGetter(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const fileStream = await this.gptService.textToSpeechGetter(fileId);
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
}
