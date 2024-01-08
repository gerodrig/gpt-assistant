import OpenAI from 'openai';

type Options = {
    threadId: string;
};

export const getMessageListUseCase = async (openai: OpenAI, {threadId}: Options) => {

    const messageList = await openai.beta.threads.messages.list(threadId);

    const messages = messageList.data.map(({role, content}) => ({
        role: role,
        content: content.map(({text}: any) => text.value)
    }));

    return messages;
}; 