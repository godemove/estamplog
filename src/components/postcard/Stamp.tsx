/**
 * 带锯齿打孔边的邮票。
 *
 * ⚠️ 当前**没有任何页面在使用它**：卡片上的邮票已按用户要求整体去掉 ——
 * 理由是"即使拟物很完整，网页的视觉效果会很乱"。别再顺手把它加回卡片上。
 *
 * 如果将来要复活（例如只贴在详情页背面 —— 那才是真明信片上贴票的位置），
 * 请一并遵守这几条，否则会退回成"带价签的宝丽来"：
 *   1. 图案必须**另给一张**，绝不能复用卡片自己的照片（同一张图印两遍 = 一眼复制粘贴）；
 *      竖版 `300/360`，真邮票多为竖版或方形，横版会读成"照片缩略图"。
 *   2. 面值写 `1.20` + 小字`元`，墨色叠印、**不要半透明底框** —— `¥1.20` 加圆角底框是电商价签语言。
 *   3. 小尺寸必须配 `.stamp-perf-fine`（`--hole: 3px`），5px 的孔在 64px 宽的票上读成撕口票根。
 *   4. 加印刷内框并保留白边，否则"满版照片 + 底部说明条 + 角上价签"就是拍立得的语法。
 *
 * 已挑选并验证可访问的图案 id（竖版风景，与本仓库 8 篇博文一一对应）：
 *   287 河谷 / 277 金色大地 / 218 静水天际线 / 256 雪峰 / 271 南岸白浪 /
 *   260 雾中松林 / 202 林间公路 / 244 水边木桩
 */
type Props = {
  image: string;
  label?: string;
  price?: string;
  className?: string;
  rotate?: number;
};

export default function Stamp({ image, label = "中国邮政", price = "1.20", className = "", rotate = 6 }: Props) {
  return (
    <div
      className={`stamp-perf stamp-perf-fine bg-white p-1.5 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative border border-forest/35">
        <img
          src={image}
          alt=""
          loading="lazy"
          aria-hidden
          className="aspect-[5/6] w-full object-cover"
          style={{ filter: "sepia(0.32) saturate(1.02) contrast(1.06)" }}
        />
        {/* 面值：墨色叠印在图案上，真票不会带一个浅色底的圆角框 */}
        <span
          className="absolute bottom-0 right-0 px-1 font-display text-[10px] leading-snug text-[#1a3d2e] mix-blend-multiply"
          style={{ textShadow: "0 0 4px rgba(252,249,243,0.95), 0 0 2px rgba(252,249,243,0.95)" }}
        >
          {price}
          <span className="ml-px text-[8px]">元</span>
        </span>
      </div>
      <p className="pt-1 text-center font-kai text-[9px] leading-none tracking-[0.15em] text-forest/80">{label}</p>
    </div>
  );
}
