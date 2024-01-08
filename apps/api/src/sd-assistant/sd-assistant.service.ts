import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import {
  createMessageUseCase,
  createThreadUseCase,
  createRunUseCase,
  checkRunCompleteStatusUseCase,
  getMessageListUseCase,
} from './use-cases';
import { QuestionDto } from './dtos';

@Injectable()
export class SdAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    const { id } = await createThreadUseCase(this.openai);

    return { id };
  }

  async userQuestion({ threadId, question }: QuestionDto) {
    const message = await createMessageUseCase(this.openai, {
      threadId,
      question,
    });
    console.log({ message });

    const run = await createRunUseCase(this.openai, { threadId });

    await checkRunCompleteStatusUseCase(this.openai, {
      threadId,
      runId: run.id,
    });

    const messages = await getMessageListUseCase(this.openai, { threadId });

    //reverse the messages so that the last message is the bot's response
    return messages.reverse();
  }
}
