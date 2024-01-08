import { useEffect, useRef, useState } from 'react';

export const useCanva = (imageUrl: string, onImageSelected: (url: string) => void) => {

    const originalImageRef = useRef<HTMLImageElement>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });

      useEffect(() => {

        const canvas = canvasRef.current!;
        const ctx = canvas?.getContext('2d');

        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = imageUrl;

        originalImageRef.current = image;

        image.onload = () => {
          ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      //? Canva functions
      const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setIsDrawing(true);

        //? Get the coordinates of the mouse relative to the canvas
        const startX = e.clientX - canvasRef.current!.getBoundingClientRect().left;
        const startY = e.clientY - canvasRef.current!.getBoundingClientRect().top;

        //? Set the coordinates
        setCoords({x: startX, y: startY});
      };

      const onMouseUp = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current!;
        const url = canvas.toDataURL("image/png");
        // console.log(url);
        onImageSelected && onImageSelected(url);

      };

      const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isDrawing) return;

        const currentX = e.clientX - canvasRef.current!.getBoundingClientRect().left;
        const currentY = e.clientY - canvasRef.current!.getBoundingClientRect().top;

        //? Calculate the width and height of the rectangle
        const width = currentX - coords.x;
        const height = currentY - coords.y;

        const canvaWidth = canvasRef.current!.width;
        const canvaHeight = canvasRef.current!.height;

        //? Clear the previous rectangle
        const ctx = canvasRef.current!.getContext('2d')!;

        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx.drawImage(originalImageRef.current!, 0, 0, canvaWidth, canvaHeight);

        //? Draw the rectangle
        // ctx.fillRect(coords.x, coords.y, width, height);
        ctx.clearRect(coords.x, coords.y, width, height);
      };

      const resetCanva = () => {
        const ctx = canvasRef.current!.getContext('2d')!;
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx.drawImage(originalImageRef.current!, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

        onImageSelected && onImageSelected(imageUrl);
      };


    return {
        canvasRef,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        resetCanva,
    };
};