import { FormEvent, useRef, useState } from 'react';

type Props = {
  onSendMessage: (message: string, file: File) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  accept?: string;
};

export const TextMessageBoxFile = ({
  onSendMessage,
  placeholder,
  disableCorrections = false,
  accept,
}: Props) => {
  const [message, setMessage] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (message.trim().length === 0) return;
    if (!selectedFile) return;

    onSendMessage(message, selectedFile);
    setMessage('');
    setSelectedFile(null);
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-row items-center w-full h-16 px-4 bg-white rounded-xl"
    >
      <div className="mr-3">
        <button
          type="button"
          className="flex items-center justify-center text-gray-400 hover:text-gray-600"
          onClick={() => inputFileRef.current?.click()}
        >
          <i className="text-xl fa-solid fa-paperclip"></i>
        </button>
        <input
          ref={inputFileRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
        />
      </div>
      <div className="flex-grow">
        <div className="relative w-full">
          <input
            type="text"
            autoFocus
            name="message"
            className="flex w-full h-10 pl-4 text-gray-800 border rounded-xl focus:outline-none focus:border-indigo-300"
            placeholder={placeholder}
            autoComplete={disableCorrections ? 'on' : 'off'}
            autoCorrect={disableCorrections ? 'on' : 'off'}
            spellCheck={disableCorrections ? true : false}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
      </div>
      <div className="ml-4">
        <button className="btn-primary" disabled={!selectedFile}>
          {!selectedFile ? (
            <span className="mr-2">Send</span>
          ) : (
            <span className="mr-2">
              {selectedFile.name.substring(0, 10) + '...'}
            </span>
          )}
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};
