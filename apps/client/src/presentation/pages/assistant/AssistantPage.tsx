import { useState, useEffect } from 'react';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
  ServiceDeskAssistantMessageBox,
} from '../../components';
import { useThreadId } from '../../../hooks';
import { postQuestionUseCase } from '../../../core';

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { threadId } = useThreadId();

  useEffect(() => {
    if(threadId){
      setMessages((prev) => [...prev, {text: 'Thread ID: ' + threadId, isGpt: true}]);
    }
  }, [threadId])
  

  const handlePost = async (text: string) => {

    if(!threadId) return;

    setIsLoading(true);
    setMessages([...messages, { text, isGpt: false }]);

    //? Usecase
    const replies = await postQuestionUseCase(threadId, text);

    setIsLoading(false);

    for(const reply of replies){
      for(const message of reply.content){
        setMessages((prev) => [...prev, {text: message, isGpt: reply.role === 'assistant', info: reply}]);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome */}
          <GptMessage
            text="This is the assistant that helps with service desk closing note. Enter the user input and brief steps and I will help create the closing notes." />

          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <GptMessage key={index} text={text} />
            ) : (
              <UserMessage key={index} text={text} />
            )
          )}

          {isLoading && <TypingLoader className="col-start-1 col-end-12 fade-in" />}

        </div>
      </div>

      <ServiceDeskAssistantMessageBox
        onSendMessage={handlePost}
        disableCorrections
      />
    </div>
  );
};
