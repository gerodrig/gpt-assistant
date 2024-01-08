import { useState } from 'react';
import {
  GptMessage,
  TypingLoader,
  UserMessage,
  TextMessageBox,
  // GptMessageImage,
  GptMessageSelectableImage,
} from '../../components';
import { imageGenerationUseCase, imageVariationUseCase } from '../../../core';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    image: string;
    alt: string;
  };
}

export const ImageTuningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    // {
    //   isGpt: true,
    //   text: 'Base image',
    //   info: {
    //     alt: 'Base image',
    //     image:
    //       'https://text-to-speech-s3-gerodrig.s3.us-east-1.amazonaws.com/1704666015029.png',
    //   },
    // },
  ]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);

    const response = await imageVariationUseCase(
      originalImageAndMask.original!
    );
    setIsLoading(false);

    if (!response) {
      return setMessages((prev) => [
        ...prev,
        { text: "Sorry, image couldn't be generated", isGpt: true },
      ]);
    }

    //? If there is a reponse
    setMessages((prev) => [
      ...prev,
      {
        text: 'Here is your variation',
        isGpt: true,
        info: {
          image: response.url,
          alt: response.alt,
        },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages([...messages, { text, isGpt: false }]);

    //TODO: Usecase
    const {original, mask} = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask);
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "Sorry, image couldn't be generated", isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          image: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);
  };

  return (
    <>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editing</span>
          <img
            src={originalImageAndMask.mask ?? originalImageAndMask.original}
            alt="original"
            className="border rounded-xl w-36 h-36 object-contain"
          />
          <button onClick={handleVariation} className="btn-primary mt-2">
            Generate variation
          </button>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/* Welcome */}
            <GptMessage text="What image would you like to have generated?" />

            {messages.map(({ text, isGpt, info }, index) =>
              isGpt ? (
                // <GptMessageImage
                <GptMessageSelectableImage
                  key={index}
                  imageUrl={info!.image!}
                  alt={info!.alt!}
                  onImageSelected={(maskImageUrl) =>
                    setOriginalImageAndMask({
                      original: info!.image!,
                      mask: maskImageUrl,
                    })
                  }
                />
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
    </>
  );
};
