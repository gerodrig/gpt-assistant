import { FormEvent, useState } from 'react';

type Props = {
  onSendMessage: (message: string, selectedOption: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  options: Option[];
};

type Option = {
  id: string;
  name: string;
};

export const TextMessageBoxSelect = ({
  onSendMessage,
  placeholder,
  disableCorrections = false,
  options,
}: Props) => {
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('')

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim().length === 0) return;
    if(selectedOption.trim().length === 0) return;

    onSendMessage(message, selectedOption);
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
    >
      <div className="flex-grow">
        <div className="flex">
          <input
            type="text"
            autoFocus
            name="message"
            className="w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder={placeholder}
            autoComplete={disableCorrections ? 'on' : 'off'}
            autoCorrect={disableCorrections ? 'on' : 'off'}
            spellCheck={disableCorrections ? true : false}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          <select
            name="select"
            className="w-2/5 ml-5 border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            value={selectedOption}
            onChange={(event) => setSelectedOption(event.target.value)}
          >
            <option value="" disabled>Select</option>
            {
              options.map(({id,name}) => (
                <option key={id} value={id}>{name}</option>
              ))
            }
          </select>
        </div>
      </div>
      <div className="ml-4">
        <button className="btn-primary">
          <span className="mr-2">Send</span>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};
