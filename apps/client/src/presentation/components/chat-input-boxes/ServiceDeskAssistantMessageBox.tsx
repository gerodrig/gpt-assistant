import { FormEvent, useState } from 'react';

type Props = {
  onSendMessage: (message: string) => void;
  disableCorrections?: boolean;
};

export const ServiceDeskAssistantMessageBox = ({
  onSendMessage,
  disableCorrections = false,
}: Props) => {
  const [message, setMessage] = useState({
    userInput: '',
    resolution: '',
  });

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.userInput.trim().length === 0 || message.resolution.trim().length === 0) return;

    onSendMessage(message.userInput + ' ' + message.resolution);
    setMessage({
      userInput: '',
      resolution: '',
    });
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-row w-full gap-2 px-4 bg-white h-96 rounded-xl "
    >

          <textarea
            // type="text"
            autoFocus
            name="userInput"
            className="flex w-full h-auto pt-4 pl-4 my-4 mb-5 text-gray-800 border rounded-xl focus:outline-none focus:border-indigo-300"
            placeholder='Write the user input here'
            autoComplete={disableCorrections ? 'on' : 'off'}
            autoCorrect={disableCorrections ? 'on' : 'off'}
            spellCheck={disableCorrections ? true : false}
            value={message.userInput}
            onChange={(event) => setMessage({userInput: 'user input:' + event.target.value, resolution: message.resolution})}
          />
          <textarea
            // type="text"
            autoFocus
            name="resolution"
            className="flex w-full h-auto pt-4 pl-4 my-4 text-gray-800 border rounded-xl focus:outline-none focus:border-indigo-300"
            placeholder='Write the resolution here'
            autoComplete={disableCorrections ? 'on' : 'off'}
            autoCorrect={disableCorrections ? 'on' : 'off'}
            spellCheck={disableCorrections ? true : false}
            value={message.resolution}
            onChange={(event) => setMessage({userInput: message.userInput, resolution: 'resolution' + event.target.value})}
          />

      <div className="self-center">
        <button className="btn-primary w-28">
          <span className="mr-2">Send</span>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};
