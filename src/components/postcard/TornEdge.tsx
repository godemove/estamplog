type Props = {
  fill: string;
  flip?: boolean;
  className?: string;
};

/** 手撕纸边缘分隔条：不规则撕裂锯齿，跨整宽拉伸 */
export default function TornEdge({ fill, flip = false, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden
      className={`block h-8 w-full sm:h-12 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        fill={fill}
        d="M0,64 L0,40 L31,46 L58,32 L89,43 L121,27 L153,41 L184,35 L216,47 L249,30 L280,42 L312,25 L343,38 L375,45 L407,29 L438,40 L471,33 L502,46 L535,28 L566,41 L598,36 L631,44 L662,26 L694,39 L727,31 L758,45 L791,34 L822,42 L855,27 L886,40 L918,37 L951,46 L983,30 L1014,41 L1047,28 L1078,39 L1111,44 L1142,32 L1175,42 L1206,26 L1238,38 L1271,45 L1302,33 L1334,41 L1367,29 L1398,40 L1440,34 L1440,64 Z"
      />
    </svg>
  );
}
