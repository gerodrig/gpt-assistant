import OpenAI from 'openai';

type Options = {
  threadId: string;
  assistantId?: string;
};

export const createRunUseCase = async (
  openai: OpenAI,
  { threadId, assistantId = process.env.OPENAI_DEFAULT_ASSISTANT_ID }: Options,
) => {

    const run = await openai.beta.threads.runs.create(threadId,{
        assistant_id: assistantId,
        // instructions //! if defined This overwrite the assitant instructions.
    });
    console.log(run);
    return run;
};
