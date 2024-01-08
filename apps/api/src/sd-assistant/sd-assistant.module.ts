import { Module } from '@nestjs/common';
import { SdAssistantService } from './sd-assistant.service';
import { SdAssistantController } from './sd-assistant.controller';

@Module({
  controllers: [SdAssistantController],
  providers: [SdAssistantService],
})
export class SdAssistantModule {}
