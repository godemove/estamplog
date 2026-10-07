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
        // 必须自己消费 Tailwind 的 translate 变量：行内 transform 会整条覆盖
        // className 里的 -translate-x-1/2，胶带就不会真正居中（历史上就是这样偏了半个身位）
        transform: `translate(var(--tw-translate-x, 0), var(--tw-translate-y, 0)) rotate(${rotate}deg)`,
        background: `repeating-linear-gradient(45deg, ${color}cc 0 10px, ${color}b3 10px 20px)`,
      }}
    />
  );
}
