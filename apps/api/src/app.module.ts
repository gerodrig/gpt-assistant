import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GptModule } from './gpt/gpt.module';
import { AdaptersModule } from './adapters/adapters.module';
import { SdAssistantModule } from './sd-assistant/sd-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    AdaptersModule,
    SdAssistantModule
  ],
})
export class AppModule {}
