import { useCanva } from '../../../hooks';

type Props = {
  imageUrl: string;
  onImageSelected: (imageUrl: string) => void;
  height?: CanvaSize;
  width?: CanvaSize;
};

type CanvaSize = '1024' | '800';

export const Canva = ({
  imageUrl,
  onImageSelected,
  height = '1024',
  width = '1024',
}: Props) => {
  const { canvasRef, onMouseDown, onMouseUp, onMouseMove, resetCanva } =
    useCanva(imageUrl, onImageSelected);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={height}
        height={width}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
      <button onClick={resetCanva} className="btn-primary mt-2">Clear Selection</button>
    </>
  );
};
