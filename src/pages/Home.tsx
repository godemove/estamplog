import { posts } from "@/data/posts";
import MiniPostcard from "@/components/postcard/MiniPostcard";
import Postmark from "@/components/postcard/Postmark";

const rotations = [-4, 3, -2, 5, -3, 2, -5, 4];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
      {/* 标题：一行字 + 一枚邮戳，仅此而已 */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-kai text-5xl leading-tight text-forest sm:text-7xl">远山来信</h1>
          <p className="mt-2 font-hand text-2xl text-airmail sm:text-3xl">
            every journey deserves a stamp
          </p>
        </div>
        <Postmark
          city="远山邮局"
          date="2026.09"
          size={110}
          className="hidden shrink-0 -rotate-12 mix-blend-multiply sm:block"
        />
      </div>

      {/* 全部内容：散落摆放的明信片 */}
      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:mt-16 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-3">
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
