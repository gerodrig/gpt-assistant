import './TypingLoader.css';

type Props = {
  className?: string;
};

export const TypingLoader = ({ className }: Props) => {
  return (
    <div className={`${className}`}>
      <div className="typing">
        <span className="circle scaling"></span>
        <span className="circle scaling"></span>
        <span className="circle scaling"></span>
      </div>
    </div>
  );
};
