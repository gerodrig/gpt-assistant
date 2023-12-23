import { Message } from '../interfaces/message.interface';

type MessageStreamDecoder = {
    reader: ReadableStreamDefaultReader<Uint8Array> | null;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const messageDecoder = async ({reader, setMessages}: MessageStreamDecoder) => {
    const decoder = new TextDecoder();
    let message = '';

    setMessages((messages) => [...messages, {text: 'Loading...', isGpt: false}]);

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader?.read() as { done: boolean; value: Uint8Array };
        if (done) break;
        const decodedChunk = decoder.decode(value, { stream: true });
        message += decodedChunk;
        setMessages((messages) => {
          const newMessages = [...messages];
          newMessages[newMessages.length - 1].text = message;
          return newMessages;
        });
      }
};