import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { AdaptersModule } from './adapters/adapters.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    AdaptersModule
  ],
})
export class AppModule {}
