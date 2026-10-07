import { Link, useSearchParams } from "react-router";
import { posts } from "@/data/posts";
import Postcard from "@/components/postcard/Postcard";
import Postmark from "@/components/postcard/Postmark";

const rotations = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 2];

export default function Posts() {
  // 详情页的标签点过来会带 ?tag=xxx，这里按标签分拣
  const [params] = useSearchParams();
  const tag = (params.get("tag") ?? "").trim();
  const list = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-display text-xs tracking-[0.4em] text-terra">
            {tag ? "TAGGED POSTCARDS · 按标签分拣" : "ALL POSTCARDS · 全部投递记录"}
          </p>
          <h1 className="mt-3 font-kai text-4xl text-forest sm:text-5xl">游记明信片</h1>
          <p className="mt-3 font-hand text-xl text-airmail">
            {tag
              ? `${list.length} postcards tagged # ${tag}`
              : `${posts.length} postcards, sent from the road`}
          </p>
          {tag && (
            <Link
              to="/posts"
              title="清除标签筛选"
              className="mt-4 inline-flex min-h-11 items-center gap-2 border border-dashed border-terra/60 px-3 font-kai text-sm text-terra transition-colors hover:bg-terra/5 focus-visible:bg-terra/5 focus-visible:outline-none sm:min-h-0 sm:py-1"
            >
              <span># {tag}</span>
              <span aria-hidden className="text-ink/45">✕</span>
              <span className="text-ink/55">显示全部</span>
            </Link>
          )}
        </div>
        <Postmark city="分拣处" date="SORTED" size={100} className="hidden -rotate-12 mix-blend-multiply sm:block" />
      </div>

      {list.length > 0 ? (
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
          {list.map((p, i) => (
            <Postcard
              key={p.slug}
              post={p}
              rotate={rotations[i % rotations.length]}
              className={i % 3 === 1 ? "lg:translate-y-6" : ""}
            />
          ))}
        </div>
      ) : (
        <div className="mt-14 border border-dashed border-sand bg-lace/40 px-6 py-16 text-center">
          <p className="font-kai text-2xl text-forest">还没有贴着「# {tag}」的明信片</p>
          <p className="mt-3 font-hand text-xl text-ink/55">no postcards carry this tag yet</p>
          <Link
            to="/posts"
            className="mt-6 inline-flex min-h-11 items-center font-kai text-airmail underline decoration-dashed underline-offset-8"
          >
            回到全部明信片 →
          </Link>
        </div>
      )}
    </div>
  );
}
