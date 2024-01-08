// import { useEffect, useRef, useState } from "react";
import { Canva } from '../images/Canva';

type Props = {
  text?: string;
  imageUrl: string;
  alt: string;
  onImageSelected?: (imageUrl: string) => void;
};

export const GptMessageSelectableImage = ({
  // text,
  imageUrl,
  // alt,
  onImageSelected,
}: Props) => {

  return (
    
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-600 rounded-full">
          G
        </div>
        <div className="relative px-4 pt-3 pb-2 ml-3 text-sm bg-black bg-opacity-25 shadow rounded-xl overflow-wrap-break hover:cursor-pointer ">

          <Canva imageUrl={imageUrl} onImageSelected={onImageSelected!}/>

        </div>
      </div>
    </div>
  );
};
