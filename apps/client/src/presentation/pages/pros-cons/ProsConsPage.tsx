import { useState } from 'react';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
  TextMessageBox,
} from '../../components';

import { prosConsUseCase } from '../../../core';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((messages) => [...messages, { text, isGpt: false }]);

    //? Usecase
    const data = await prosConsUseCase(text);

    if (!data.ok) {
      setMessages((messages) => [
        ...messages,
        { text: "Pros and Cons Evaluation couldn't be completed", isGpt: true },
      ]);
    } else {
      setMessages((messages) => [...messages, { text: data.message, isGpt: true }]);
    }

    setIsLoading(false);

    //TODO: Add isGpt true message
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome */}
          <GptMessage
            text="Please provide a topic or a specific question you'd like to explore. I will analyze it and present a balanced comparison, detailing both the pros and cons. Your input can be about any subject—technology, lifestyle, decisions, products, strategies, etc. Just type your topic or question below, and I'll give you a comprehensive breakdown in a structured format." />

          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <GptMessage key={index} text={text}/>
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
