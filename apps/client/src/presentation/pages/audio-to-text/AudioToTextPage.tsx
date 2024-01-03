import { useState } from 'react';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
  TextMessageBoxFile,
} from '../../components';
import { audioToTextUseCase } from '../../../core';

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages([...messages, { text, isGpt: false }]);

    //? Usecase
    // console.log({ text, audioFile });
    const response = await audioToTextUseCase(audioFile, text);

    if (!response) return; //exit if no response

    //convert response to markdown
    const responseMessage = `## The Transcription is
__Duration:__ ${Math.round(response.duration)} seconds
## Text:
${response.text}
`;

    console.log(responseMessage);

    setMessages((previous) => [
      ...previous,
      { text: responseMessage, isGpt: true },
    ]);

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome */}
          <GptMessage text="Upload an audio to have it converted to text." />

          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <GptMessage key={index} text={text} />
            ) : (
              <UserMessage
                key={index}
                text={text === '' ? 'Audio Transcript' : text}
              />
            )
          )}

          {isLoading && (
            <TypingLoader className="col-start-1 col-end-12 fade-in" />
          )}
        </div>
      </div>

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Write your input here"
        disableCorrections
        accept="audio/*"
      />
    </div>
  );
};
