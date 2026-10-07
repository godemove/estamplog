import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getPost, posts, type Post } from "@/data/posts";
import Stamp from "@/components/postcard/Stamp";
import Postmark from "@/components/postcard/Postmark";
import WashiTape from "@/components/postcard/WashiTape";

/** 照片面（正面） */
function PhotoSide({ post }: { post: Post }) {
  return (
    <>
      <div className="overflow-hidden border border-sand">
        <img
          src={post.image}
          alt={post.title}
          className="w-full object-cover"
          style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
        />
      </div>
      <Stamp image={post.image} price={post.price} rotate={7} className="absolute right-2 top-2 w-20 shadow-md sm:w-24" />
      <Postmark
        city={post.location.split(" · ")[0]}
        date={post.stampDate}
        size={104}
        className="absolute bottom-3 left-3 -rotate-12 mix-blend-multiply"
      />
      <p className="mt-4 text-center font-hand text-xl text-ink/70">
        wish you were here — {post.location}
      </p>
    </>
  );
}

/** 书写面（背面）正文 */
function WritingContent({ post }: { post: Post }) {
  return (
    <>
      <p className="font-display text-[10px] tracking-[0.3em] text-ink/50">{post.coords}</p>
      <h1 className="mt-2 font-kai text-3xl leading-snug text-forest sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-ink/70">
        <span className="font-kai">{post.location}</span>
        <span className="mx-2">·</span>
        <span>{post.date}</span>
      </p>
      <div className="mt-6 space-y-5 text-[15px] leading-loose text-ink/90">
        {post.content.map((para, i) => (
          <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-kai first-letter:text-4xl first-letter:leading-none first-letter:text-terra" : ""}>
            {para}
          </p>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span key={t} className="border border-dashed border-airmail/50 px-3 py-1 font-kai text-sm text-airmail">
            # {t}
          </span>
        ))}
      </div>
      <p className="mt-8 text-right font-hand text-2xl text-airmail">— 远山</p>
    </>
  );
}

/** 移动端翻转明信片：轻触正面 → 3D 翻转到背面阅读 */
function FlipPostcard({ post }: { post: Post }) {
  const [flipped, setFlipped] = useState(
    () => new URLSearchParams(window.location.search).has("flipped"),
  );
  // 切换到另一张明信片时，翻回照片正面
  useEffect(() => {
    setFlipped(new URLSearchParams(window.location.search).has("flipped"));
  }, [post.slug]);
  return (
    <div className="relative mt-8" style={{ perspective: "1800px" }}>
      <div
        className="relative h-[74vh] min-h-[500px] w-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* 正面：照片 */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          aria-hidden={flipped}
          className="paper-shadow absolute inset-0 block w-full overflow-hidden bg-white p-4 text-left"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            pointerEvents: flipped ? "none" : "auto",
          }}
        >
          <WashiTape color="#e89b50" rotate={-5} className="-top-3 left-8 z-10" />
          <WashiTape color="#2e596c" rotate={4} className="-top-3 right-8 z-10" />
          <div className="flex h-full flex-col">
            <div className="relative aspect-[3/4] flex-1 overflow-hidden border border-sand">
              <img
                src={post.image}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
              />
              <Stamp image={post.image} price={post.price} rotate={7} className="absolute right-2 top-2 w-20 shadow-md" />
              <Postmark
                city={post.location.split(" · ")[0]}
                date={post.stampDate}
                size={104}
                className="absolute bottom-2 left-2 -rotate-12 mix-blend-multiply"
              />
            </div>
            <p className="pt-3 text-center font-hand text-xl text-ink/70">
              wish you were here — {post.location}
            </p>
          </div>
          <span className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap rounded-full bg-forest/90 px-4 py-1.5 font-kai text-sm text-paper shadow-md">
            轻触翻转 · 读这封信
          </span>
        </button>

        {/* 背面：文字 */}
        <div
          aria-hidden={!flipped}
          className="paper-shadow absolute inset-0 flex flex-col overflow-hidden bg-white"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
          }}
        >
          <WashiTape color="#c45c3e" rotate={3} className="-top-3 left-1/2 z-10 -translate-x-1/2" />
          <div className="flex items-center justify-between border-b border-dashed border-ink/25 px-4 py-2">
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="flex min-h-11 items-center font-kai text-base text-airmail"
            >
              ← 翻回照片
            </button>
            <span className="font-display text-[10px] tracking-[0.3em] text-ink/50">POST CARD</span>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-5">
            <WritingContent post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPost(slug) : undefined;

  // 滑动切换：明信片随手指拖动，松手甩出换篇
  const [drag, setDrag] = useState({ x: 0, active: false });
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);
  const [enterFrom, setEnterFrom] = useState<"left" | "right">("right");
  const touch = useRef<{ x: number; y: number; horizontal: boolean | null } | null>(null);

  const idx = post ? posts.findIndex((p) => p.slug === post.slug) : -1;
  const prev = idx > 0 ? posts[idx - 1] : undefined;
  const next = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : undefined;

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-kai text-2xl text-forest">这张明信片似乎寄丢了……</p>
        <Link to="/posts" className="mt-6 inline-block font-kai text-airmail underline decoration-dashed underline-offset-8">
          回到明信片堆 →
        </Link>
      </div>
    );
  }

  const flyTo = (dir: "left" | "right") => {
    if (leaving) return;
    setLeaving(dir);
    // 旧卡向左飞出 = 下一张从右侧进来；向右飞出 = 上一张从左侧进来
    setEnterFrom(dir === "left" ? "right" : "left");
    setTimeout(() => {
      navigate(dir === "left" ? `/post/${next!.slug}` : `/post/${prev!.slug}`, { replace: false });
      setLeaving(null);
      setDrag({ x: 0, active: false });
    }, 480);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, horizontal: null };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current || leaving) return;
    const t = e.touches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    if (touch.current.horizontal === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      touch.current.horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
    }
    if (touch.current.horizontal) {
      setDrag({ x: dx, active: true });
    }
  };

  const onTouchEnd = () => {
    if (!touch.current) return;
    const { x } = drag;
    const horizontal = touch.current.horizontal;
    touch.current = null;
    setDrag({ x: 0, active: false });
    if (!horizontal || leaving) return;
    if (x < -70 && next) flyTo("left");
    else if (x > 70 && prev) flyTo("right");
  };

  const cardStyle: React.CSSProperties = leaving
    ? {
        transform: `translateX(${leaving === "left" ? "-130%" : "130%"}) rotate(${leaving === "left" ? "-14deg" : "14deg"})`,
        opacity: 0,
        transition: "transform 0.48s cubic-bezier(0.3, 0, 0.6, 1), opacity 0.48s ease",
      }
    : drag.active
      ? {
          transform: `translateX(${drag.x}px) rotate(${drag.x * 0.045}deg)`,
          transition: "none",
        }
      : {
          transform: "translateX(0) rotate(0deg)",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        };

  return (
    <article className="mx-auto max-w-5xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <p className="font-display text-xs tracking-[0.4em] text-terra">
        POSTCARD NO.{String(idx + 1).padStart(3, "0")} · {post.titleEn}
      </p>

      {/* 滑动手势区域：整个明信片随手指走 */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative"
      >
        {/* 桌角偷偷露出的相邻明信片，示意可以滑动 */}
        {prev && (
          <div
            aria-hidden
            className="paper-shadow-sm pointer-events-none absolute -left-4 top-10 hidden w-24 overflow-hidden bg-white p-1.5 sm:block"
            style={{ transform: "rotate(-8deg)" }}
          >
            <img src={prev.image} alt="" className="aspect-[4/3] w-full object-cover" style={{ filter: "sepia(0.18)" }} />
          </div>
        )}
        {next && (
          <div
            aria-hidden
            className="paper-shadow-sm pointer-events-none absolute -right-4 top-10 hidden w-24 overflow-hidden bg-white p-1.5 sm:block"
            style={{ transform: "rotate(8deg)" }}
          >
            <img src={next.image} alt="" className="aspect-[4/3] w-full object-cover" style={{ filter: "sepia(0.18)" }} />
          </div>
        )}

        <div key={post.slug} style={cardStyle} className={leaving ? "" : `card-arrive-${enterFrom}`}>
          {/* 移动端：可翻转明信片 */}
          <div className="md:hidden">
            <FlipPostcard post={post} />
          </div>

          {/* 桌面端：正面照片 / 背面文字 左右并排 */}
          <div className="paper-shadow relative mt-8 hidden bg-white md:block">
            <WashiTape color="#e89b50" rotate={-5} className="-top-3 left-10 z-10" />
            <WashiTape color="#2e596c" rotate={4} className="-top-3 right-10 z-10" />
            <div className="grid md:grid-cols-2">
              <div className="relative p-5 sm:p-8">
                <PhotoSide post={post} />
              </div>
              <div className="postcard-divider absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px md:block" />
              <div className="relative border-t border-dashed border-ink/25 p-5 sm:p-8 md:border-t-0">
                <WritingContent post={post} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 滑动指引：纯手写体提示，不是按钮 */}
      <p className="mt-8 text-center font-hand text-xl text-ink/60">
        {prev && "→ 上一张"}{prev && next && " · "}{next && "下一张 ←"}
        <span className="ml-2 text-ink/40">slide the card</span>
      </p>
    </article>
  );
}
