import { useState } from 'react';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
  TextMessageBox,
  GptMessageImage,
} from '../../components';
import { imageGenerationUseCase } from '../../../core';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    image: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages([...messages, { text, isGpt: false }]);

    //TODO: Usecase
    const imageInfo = await imageGenerationUseCase(text);
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "Sorry, image couldn't be generated", isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          image: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);
  };

  return (
    <div className="chat-container">
    <div className="chat-messages">
      <div className="grid grid-cols-12 gap-y-2">
        {/* Welcome */}
        <GptMessage
          text="What image would you like to have generated?" />

        {messages.map(({ text, isGpt, info }, index) =>
          isGpt ? (
            <GptMessageImage key={index} imageUrl={info!.image! } alt={info!.alt!} />
          ) : (
            <UserMessage key={index} text={text} />
          )
        )}

        {isLoading && <TypingLoader className="col-start-1 col-end-12 fade-in" />}

      </div>
    </div>

    <TextMessageBox
      onSendMessage={handlePost}
      placeholder="Write your input here"
      disableCorrections
    />
  </div>
  );
};
