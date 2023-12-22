
type Props = {

  message: string;
};

export const GptOrthographyMessage = ({ message }: Props) => {
  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-600 rounded-full">
          G
        </div>
        <div className="relative px-4 pt-3 pb-2 ml-3 text-sm bg-black bg-opacity-25 shadow rounded-xl">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};
