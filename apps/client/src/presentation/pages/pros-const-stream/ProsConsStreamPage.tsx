import { useRef, useState } from 'react';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
  TextMessageBox,
} from '../../components';
// import { prosConsStreamUseCase } from '../../../core';
// import { messageDecoder } from '../../../helpers';
import { Message } from '../../../interfaces';
import { prosConsStreamGeneratorUseCase } from '../../../core';

export const ProsConsStreamPage = () => {
  //? create abort controller
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {

    //? Abort previous request
    if (isRunning.current){
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;
    setMessages([...messages, { text, isGpt: false }]);


    //? Usecase using function generator
    const stream = prosConsStreamGeneratorUseCase(text, abortController.current.signal);
    setIsLoading(false);

    setMessages((messages) => [...messages, { text: "", isGpt: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages ];
        newMessages[newMessages.length - 1].text = text;
        return newMessages;
      });
    }
    
    //? stream Usecase using decoder
    // const reader = await prosConsStreamUseCase(text);
    // setIsLoading(false);

    // if(!reader) {
    //   setMessages([...messages, { text: "Text couldn't be corrected", isGpt: true }]);
    // }
    //?Generate last message
    // await messageDecoder({reader, setMessages});

    isRunning.current = false;
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
              <GptMessage key={index} text={text} />
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
