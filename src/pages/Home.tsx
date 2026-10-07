import { posts } from "@/data/posts";
import MiniPostcard from "@/components/postcard/MiniPostcard";

const rotations = [-4, 3, -2, 5, -3, 2, -5, 4];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
      {/* 首页不再放可见标题（有意留白，让明信片自己说话）；这里只留无障碍/SEO 用的 h1 */}
      <h1 className="sr-only">远山来信 — 明信片旅行博客</h1>

      {/* 全部内容：散落摆放的明信片 */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-3">
        {posts.map((p, i) => (
          <MiniPostcard
            key={p.slug}
            post={p}
            rotate={rotations[i % rotations.length]}
            className={i % 2 === 1 ? "translate-y-4 sm:translate-y-8" : ""}
          />
        ))}
      </div>
    </div>
  );
}
