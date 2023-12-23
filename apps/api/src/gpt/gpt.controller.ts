import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsEvaluatorDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-evaluator')
  prosConsEvaluator(
    @Body() proConEvaluator: ProsConsEvaluatorDto
  ){
    return this.gptService.prosConsEvaluator(proConEvaluator);

  }

  @Post('pros-cons-evaluator-stream')
  async prosConsEvaluatorStream(
    @Body() proConEvaluator: ProsConsEvaluatorDto,
    @Res() res: Response
  ){
    const stream = await this.gptService.prosConsEvaluatorStream(proConEvaluator);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0]?.delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    res.end();
  }
}
