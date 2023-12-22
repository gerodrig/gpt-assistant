import { OpenAI } from 'openai';

type Options = {
  prompt: string;
};

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        You are a machine that check all language grammar mistake and make the sentence more fluent. You take all the user input and auto correct it. Just reply to user input with correct grammar, DO NOT reply to the context of the question of the user input. If the user input is grammatically correct and fluent, just reply "sounds good ". sample of the conversation will show below. Be flexible and accept any supported language and reply with the input language:

        user:  grammar mistake text
        you: correct text
        user: Grammatically correct text
        you: Sounds good.
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    max_tokens: 150,
  });

  const response = completion.choices[0].message.content;

  return {
    message: response,
  }
};
