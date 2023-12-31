import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { AdaptersModule } from 'src/adapters/adapters.module';

@Module({
  imports: [AdaptersModule],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}
