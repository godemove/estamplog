import { useId } from "react";

type Props = {
  city?: string;
  date?: string;
  className?: string;
  color?: string;
  size?: number;
};

/** 圆形邮戳：环形文字 + 日期 + 波浪销票线 */
export default function Postmark({
  city = "远山邮局",
  date = "2026.09",
  className = "",
  color = "#2e596c",
  size = 104,
}: Props) {
  const id = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden
      className={className}
      style={{ opacity: 0.9 }}
    >
      <defs>
        <path id={`${id}-ring`} d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
      </defs>
      <g fill="none" stroke={color}>
        <circle cx="60" cy="60" r="47" strokeWidth="2" />
        <circle cx="60" cy="60" r="30" strokeWidth="1.2" />
      </g>
      <text fill={color} fontSize="10.5" letterSpacing="2.5" fontFamily="'Bebas Neue', 'Kaiti SC', KaiTi, sans-serif">
        <textPath href={`#${id}-ring`} startOffset="2%">
          {city} · FARAWAY POST · 旅行纪念 ·
        </textPath>
      </text>
      <text
        x="60"
        y="57"
        textAnchor="middle"
        fill={color}
        fontSize="11"
        fontFamily="'Bebas Neue', 'Kaiti SC', KaiTi, sans-serif"
        letterSpacing="1"
      >
        {date}
      </text>
      <text x="60" y="72" textAnchor="middle" fill={color} fontSize="9" letterSpacing="3" fontFamily="'Kaiti SC', KaiTi, serif">
        已 验 讫
      </text>
      {/* 波浪销票线 */}
      <g stroke={color} strokeWidth="1.6" fill="none" opacity="0.85">
        <path d="M -6,44 q 8,-6 16,0 t 16,0 t 16,0" />
        <path d="M -6,54 q 8,-6 16,0 t 16,0 t 16,0" />
        <path d="M -6,64 q 8,-6 16,0 t 16,0 t 16,0" />
      </g>
    </svg>
  );
}
