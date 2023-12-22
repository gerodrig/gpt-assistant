import { useState } from 'react';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
  TextMessageBox,
} from '../components';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages([...messages, { text, isGpt: false }]);

    //TODO: Usecase

    setIsLoading(false);

    //TODO: Add isGpt true message
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome */}
          <GptMessage
            text="Welcome to Orthography Page" />

          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <GptMessage key={index} text="This is from OpenAI" />
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
