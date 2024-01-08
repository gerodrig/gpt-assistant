import { OpenAI } from 'openai';

type Options = {
    threadId: string;
    question: string;
};

export const createMessageUseCase = async (
  openai: OpenAI,
  {threadId, question}: Options
) => {

    const message = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: question,
    });


    return message;
};
