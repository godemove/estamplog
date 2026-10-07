import { Link } from "react-router";
import type { Post } from "@/data/posts";
import Postmark from "./Postmark";

type Props = {
  post: Post;
  rotate?: number;
  className?: string;
};

/** 迷你明信片：照片为主，只有一行手写落款 */
export default function MiniPostcard({ post, rotate = 0, className = "" }: Props) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className={`postcard-tilt paper-shadow group block bg-white p-2.5 pb-3 sm:p-3 ${className}`}
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
        <Postmark
          city={post.location.split(" · ")[0]}
          date={post.stampDate}
          size={72}
          className="absolute -left-3 -top-4 -rotate-12 mix-blend-multiply"
        />
      </div>
      <p className="mt-2 text-center font-hand text-base leading-tight text-ink/75 sm:text-xl">
        {post.location} — {post.stampDate}
      </p>
    </Link>
  );
}
