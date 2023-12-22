import { useState } from 'react';
import { orthographyUseCase } from '../../../core';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
  TextMessageBox,
  GptOrthographyMessage,
} from '../../components';

interface Message {
  text: string;
  isGpt: boolean;
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    ///? Call API using the use case
    const data = await orthographyUseCase(text);

    if (!data.ok) {
      setMessages((prev) => [
        ...prev,
        { text: "Text couldn't be corrected", isGpt: true },
      ]);
    } else {
      setMessages((prev) => [...prev, { text: data.message, isGpt: true }]);
    }

    setIsLoading(false);

    //TODO: Add isGpt true message
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome */}
          <GptMessage text="Welcome to Orthography Page, Pleae enter a text and I will reply with the grammar corrections." />

          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <GptOrthographyMessage key={index} message={text} />
            ) : (
              <UserMessage key={index} text={text} />
            )
          )}

          {isLoading && (
            <TypingLoader className="col-start-1 col-end-12 fade-in" />
          )}
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
