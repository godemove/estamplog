type Props = {
  image: string;
  label?: string;
  price?: string;
  className?: string;
  rotate?: number;
};

/** 带锯齿打孔边的邮票 */
export default function Stamp({ image, label = "中国邮政", price = "1.20", className = "", rotate = 6 }: Props) {
  return (
    <div
      className={`stamp-perf bg-white p-1.5 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative">
        <img
          src={image}
          alt={label}
          loading="lazy"
          className="block h-full w-full object-cover"
          style={{ filter: "sepia(0.22) saturate(1.08) contrast(1.03)" }}
        />
        <span className="absolute right-0.5 top-0.5 bg-paper/85 px-1 font-display text-[10px] leading-tight tracking-wide text-forest">
          ¥{price}
        </span>
      </div>
      <p className="pt-1 text-center font-kai text-[10px] leading-none text-ink/80">{label}</p>
    </div>
  );
}
