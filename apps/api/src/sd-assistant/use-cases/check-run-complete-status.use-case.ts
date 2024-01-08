import OpenAI from 'openai';

type Options = {
  threadId: string;
  runId: string;
};

export const checkRunCompleteStatusUseCase = async (
  openai: OpenAI,
  { threadId, runId }: Options,
) => {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (runStatus.status === 'completed') {
        return runStatus;
    }

    //Wait 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return await checkRunCompleteStatusUseCase(openai, { threadId, runId });
};
