import { useState, useRef } from 'react';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
TextMessageBoxSelect,
} from '../../components';
import { translateTextUseCase } from '../../../core';

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  {id: 'german', name: 'German'},
  {id: 'english', name: 'English'},
  {id: 'french', name: 'French'},
  {id: 'spanish', name: 'Spanish'},
  {id: 'italian', name: 'Italian'},
  {id: 'portuguese', name: 'Portuguese'},
  {id: 'russian', name: 'Russian'},
  {id: 'chinese', name: 'Chinese'},
  {id: 'japanese', name: 'Japanese'},
  {id: 'korean', name: 'Korean'},
  {id: 'arabic', name: 'Arabic'},
  {id: 'turkish', name: 'Turkish'},
  {id: 'hindi', name: 'Hindi'},
  {id: 'indonesian', name: 'Indonesian'},
  {id: 'thai', name: 'Thai'},
  {id: 'vietnamese', name: 'Vietnamese'},
  {id: 'dutch', name: 'Dutch'},
  {id: 'polish', name: 'Polish'},
  {id: 'greek', name: 'Greek'},
];

export const TranslatePage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedOption: string) => {

    //? Abort previous request
    if(isRunning.current){
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    //? process start
    setIsLoading(true);
    isRunning.current = true;

    const newMessage = `Translate: "${text}" to ${selectedOption}`;
    setMessages([...messages, { text: newMessage, isGpt: false }]);

    //? Translate Usecase using stream
    const stream = translateTextUseCase(text, selectedOption, abortController.current.signal);
    setIsLoading(false);

    setMessages((messages) => [...messages, { text: "", isGpt: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages ];
        newMessages[newMessages.length - 1].text = text;
        return newMessages;
      });
    }

    isRunning.current = false;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome */}
          <GptMessage
            text="Welcome to Translate Page. Please enter a text to be translated." />

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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Write your input here"
        options={languages}
      />
    </div>
  );
};
