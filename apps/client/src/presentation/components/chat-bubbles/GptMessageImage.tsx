type Props = {
  text?: string;
  imageUrl: string;
  alt: string;
  onImageSelected?: (imageUrl: string) => void;
};

export const GptMessageImage = ({
  text,
  imageUrl,
  alt,
  onImageSelected,
}: Props) => {
  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-600 rounded-full">
          G
        </div>
        <div className="relative px-4 pt-3 pb-2 ml-3 text-sm bg-black bg-opacity-25 shadow rounded-xl overflow-wrap-break hover:cursor-pointer ">
          {text && <span>{text}</span>}
          <img
            onClick={() => onImageSelected && onImageSelected(imageUrl)}
            src={imageUrl}
            alt={alt}
            className="mt-2 rounded-xl w-96 h-96 object-cover"
          />
        </div>
      </div>
    </div>
  );
};
