import { OpenAI } from 'openai';
import type { Stream } from 'openai/streaming';

type Options = {
  prompt: string;
  language: string;
  stream: boolean;
};

export const translateUseCase = async (
  openai: OpenAI,
  { prompt, language, stream }: Options,
) => {
  const translate = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    max_tokens: 1500,
    stream: stream,
    messages: [
      {
        role: 'system',
        content: `
                You are a machine that translate all language to ${language}. Translate the following text and DO NOT reply to the context:${prompt}
                `,
      },
    ],
  });

  if (stream) {
    return translate as Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;
  }

  const response = (translate as OpenAI.Chat.Completions.ChatCompletion).choices[0].message.content as string;

  return {
    message: response,
  };
};
