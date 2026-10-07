type Props = {
  color?: string;
  rotate?: number;
  className?: string;
};

/** 和纸胶带 */
export default function WashiTape({ color = "#e89b50", rotate = -4, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`washi ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        background: `repeating-linear-gradient(45deg, ${color}cc 0 10px, ${color}b3 10px 20px)`,
      }}
    />
  );
}
