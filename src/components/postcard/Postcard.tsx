import { Link } from "react-router";
import type { Post } from "@/data/posts";
import Stamp from "./Stamp";
import Postmark from "./Postmark";

type Props = {
  post: Post;
  rotate?: number;
  className?: string;
};

/** 游记明信片卡片：照片 + 邮票 + 邮戳 + 手写体标题 */
export default function Postcard({ post, rotate = 0, className = "" }: Props) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className={`postcard-tilt paper-shadow group block bg-white p-3 pb-5 sm:p-4 sm:pb-6 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative">
        <div className="overflow-hidden border border-sand">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
          />
        </div>
        <Stamp
          image={post.image}
          price={post.price}
          rotate={7}
          className="absolute -right-3 -top-4 w-16 shadow-md sm:w-20"
        />
        <Postmark
          city={post.location.split(" · ")[0]}
          date={post.stampDate}
          size={92}
          className="absolute -left-4 -top-5 -rotate-12 mix-blend-multiply"
        />
      </div>
      <div className="px-1 pt-4">
        <p className="font-display text-[11px] tracking-[0.25em] text-terra">{post.titleEn}</p>
        <h3 className="mt-1 font-kai text-xl leading-snug text-forest sm:text-2xl">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/85">{post.excerpt}</p>
        <div className="mt-3 flex items-center justify-between border-t border-dashed border-ink/25 pt-3 text-xs text-ink/70">
          <span className="font-kai">{post.location}</span>
          <span className="font-display tracking-[0.15em]">{post.coords}</span>
        </div>
      </div>
    </Link>
  );
}
