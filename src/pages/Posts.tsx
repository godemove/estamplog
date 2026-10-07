import { posts } from "@/data/posts";
import Postcard from "@/components/postcard/Postcard";
import Postmark from "@/components/postcard/Postmark";

const rotations = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 2];

export default function Posts() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-display text-xs tracking-[0.4em] text-terra">ALL POSTCARDS · 全部投递记录</p>
          <h1 className="mt-3 font-kai text-4xl text-forest sm:text-5xl">游记明信片</h1>
          <p className="mt-3 font-hand text-xl text-airmail">
            {posts.length} postcards, sent from the road
          </p>
        </div>
        <Postmark city="分拣处" date="SORTED" size={100} className="hidden -rotate-12 mix-blend-multiply sm:block" />
      </div>

      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
        {posts.map((p, i) => (
          <Postcard
            key={p.slug}
            post={p}
            rotate={rotations[i % rotations.length]}
            className={i % 3 === 1 ? "lg:translate-y-6" : ""}
          />
        ))}
      </div>
    </div>
  );
}
