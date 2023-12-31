import { useState } from 'react';
import {
  GptMessage,
  GptMessageAudio,
  TypingLoader,
  UserMessage,
TextMessageBoxSelect,
} from '../../components';
import { textToAudioUseCase } from '../../../core/';

const disclaimer = `## Enter a text to convert it to audio
* All the audio converted is AI generated`;

//Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
const voices = [
  {id: 'nova', name: 'Nova'},
  {id: 'alloy', name: 'Alloy'},
  {id: 'echo', name: 'Echo'},
  {id: 'fable', name: 'Fable'},
  {id: 'onyx', name: 'Onyx'},
  {id: 'shimmer', name: 'Shimmer'},
]

type TextMessage = {
  text: string;
  isGpt: boolean;
  type: 'text'
}

type AudioMessage = {
  text: string;
  isGpt: boolean;
  audio:string;
  type: 'audio'
}

type Message = TextMessage | AudioMessage;


export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((message) => [...message, { text, isGpt: false, type: 'text' }]);

    //? Usecase
    const {ok, message, audioUrl} = await textToAudioUseCase(text, selectedVoice);


    setIsLoading(false);

    if(!ok) return;

    //? Add isGpt true message
    setMessages((prev) => [...prev, { text: `${selectedVoice } - ${message}`, isGpt: true, type: 'audio', audio: audioUrl!}]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Welcome */}
          <GptMessage
            text={disclaimer} />

          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === 'audio' ?
              <GptMessageAudio key={index} text={message.text} audio={message.audio} />
              : <GptMessage key={index} text={message.text} />
            ) : (
              <UserMessage key={index} text={message.text} />
            )
          )}

          {isLoading && <TypingLoader className="col-start-1 col-end-12 fade-in" />}

        </div>
      </div>

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Write your input here"
        options={voices}
      />
    </div>
  )
}
