import { useCallback, useEffect, useRef, useState } from "react";
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
          <Link
            key={t}
            to={`/posts?tag=${encodeURIComponent(t)}`}
            title={`看看贴着「${t}」标签的明信片`}
            className="inline-flex min-h-11 items-center border border-dashed border-airmail/50 px-3 font-kai text-sm text-airmail transition-colors hover:border-terra hover:bg-terra/5 hover:text-terra focus-visible:border-terra focus-visible:text-terra focus-visible:outline-none sm:min-h-0 sm:py-1"
          >
            # {t}
          </Link>
        ))}
      </div>
      <p className="mt-8 text-right font-hand text-2xl text-airmail">— 远山</p>
    </>
  );
}

/** 相邻明信片导航按钮：桌面可点击、移动端可轻触，都能翻篇 */
function NavButton({
  direction,
  post,
  onGo,
  disabled,
}: {
  direction: "prev" | "next";
  post: Post;
  onGo: () => void;
  disabled?: boolean;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onGo}
      disabled={disabled}
      aria-label={`${isPrev ? "上一张" : "下一张"}明信片：${post.title}`}
      className={`group flex min-h-11 min-w-0 max-w-56 flex-1 items-center gap-2 border border-dashed border-airmail/40 bg-white/70 px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-terra/70 hover:bg-white focus-visible:-translate-y-0.5 focus-visible:border-terra focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 ${
        isPrev ? "text-left" : "flex-row-reverse text-right"
      }`}
    >
      <span
        aria-hidden
        className="font-display text-lg leading-none text-airmail transition-colors group-hover:text-terra"
      >
        {isPrev ? "←" : "→"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-kai text-xs tracking-[0.2em] text-ink/50">
          {isPrev ? "上一张" : "下一张"}
        </span>
        <span className="hidden truncate font-kai text-base text-forest sm:block">{post.title}</span>
      </span>
    </button>
  );
}

/** 到头了：该侧没有相邻明信片时占位，保持左右对称（不可点，纯提示） */
function NavPlaceholder({ direction }: { direction: "prev" | "next" }) {
  const isPrev = direction === "prev";
  return (
    <span
      aria-hidden
      className={`flex min-h-11 min-w-0 max-w-56 flex-1 items-center gap-2 border border-dashed border-sand bg-lace/40 px-3 py-2 ${
        isPrev ? "text-left" : "flex-row-reverse text-right"
      }`}
    >
      <span className="font-display text-lg leading-none text-ink/20">{isPrev ? "←" : "→"}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-kai text-xs tracking-[0.2em] text-ink/30">
          {isPrev ? "上一张" : "下一张"}
        </span>
        <span className="block truncate font-kai text-base text-ink/35">
          {isPrev ? "已是第一张" : "已是最后一张"}
        </span>
      </span>
    </span>
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

  // 翻篇：旧卡先飞出 480ms，再 navigate，新卡从相反方向入场
  const flyTo = useCallback(
    (dir: "left" | "right") => {
      const target = dir === "left" ? next : prev;
      if (leaving || !target) return;
      setLeaving(dir);
      // 旧卡向左飞出 = 下一张从右侧进来；向右飞出 = 上一张从左侧进来
      setEnterFrom(dir === "left" ? "right" : "left");
      window.setTimeout(() => {
        navigate(`/post/${target.slug}`, { replace: false });
        setLeaving(null);
        setDrag({ x: 0, active: false });
      }, 480);
    },
    [leaving, navigate, next, prev],
  );

  // 桌面端键盘翻篇：← 上一张 / → 下一张
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
      if (e.key === "ArrowLeft" && prev) {
        e.preventDefault();
        flyTo("right");
      } else if (e.key === "ArrowRight" && next) {
        e.preventDefault();
        flyTo("left");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flyTo, next, prev]);

  // 全屏观看：CSS 全屏层永远生效，能进原生全屏就顺带进去（iOS Safari 不支持元素全屏）
  const [fullscreen, setFullscreen] = useState(false);
  const fsLayer = useRef<HTMLDivElement | null>(null);
  const fsExit = useRef<HTMLButtonElement | null>(null);
  const wantNativeFs = useRef(false);

  const enterFullscreen = () => {
    wantNativeFs.current = true;
    setFullscreen(true);
  };

  const exitFullscreen = useCallback(() => {
    wantNativeFs.current = false;
    setFullscreen(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    if (wantNativeFs.current && !document.fullscreenElement) {
      fsLayer.current?.requestFullscreen?.().catch(() => {});
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fsExit.current?.focus();
    const onFsChange = () => {
      if (!document.fullscreenElement && wantNativeFs.current) exitFullscreen();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitFullscreen();
    };
    document.addEventListener("fullscreenchange", onFsChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("fullscreenchange", onFsChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fullscreen, exitFullscreen]);

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-xs tracking-[0.4em] text-terra">
          POSTCARD NO.{String(idx + 1).padStart(3, "0")} · {post.titleEn}
        </p>
        <button
          type="button"
          onClick={enterFullscreen}
          title="全屏观看这张明信片（Esc 退出）"
          className="hidden min-h-11 items-center border border-dashed border-airmail/40 px-3 font-kai text-sm text-airmail transition-colors hover:border-terra hover:bg-terra/5 hover:text-terra focus-visible:border-terra focus-visible:outline-none md:inline-flex"
        >
          全屏观看
        </button>
      </div>

      {/* 滑动手势区域：整个明信片随手指走 */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative"
      >
        {/* 桌角露出的一角相邻明信片：可直接点击翻篇
            露出宽度 = 偏移量（-left-24 = 露出 96px），别缩小偏移；
            只在 xl(≥1280) 显示 —— 更窄时侧边空间不够，会被窗口裁成断口 */}
        {prev && (
          <button
            type="button"
            onClick={() => flyTo("right")}
            disabled={leaving !== null}
            title={`上一张：${prev.title}`}
            aria-label={`上一张明信片：${prev.title}`}
            className="paper-shadow-sm absolute -left-24 top-12 hidden w-40 -rotate-[8deg] overflow-hidden bg-white p-2 transition-transform duration-300 hover:-translate-x-3 hover:-translate-y-1 hover:rotate-0 focus-visible:-translate-x-3 focus-visible:rotate-0 focus-visible:outline-none disabled:opacity-40 xl:block"
          >
            <img
              src={prev.image}
              alt=""
              className="aspect-[4/3] w-full border border-sand object-cover"
              style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
            />
            <p className="mt-1.5 truncate text-left font-hand text-base leading-tight text-ink/70">
              {prev.location.split(" · ")[1] ?? prev.location}
            </p>
          </button>
        )}
        {next && (
          <button
            type="button"
            onClick={() => flyTo("left")}
            disabled={leaving !== null}
            title={`下一张：${next.title}`}
            aria-label={`下一张明信片：${next.title}`}
            className="paper-shadow-sm absolute -right-24 top-12 hidden w-40 rotate-[8deg] overflow-hidden bg-white p-2 transition-transform duration-300 hover:translate-x-3 hover:-translate-y-1 hover:rotate-0 focus-visible:translate-x-3 focus-visible:rotate-0 focus-visible:outline-none disabled:opacity-40 xl:block"
          >
            <img
              src={next.image}
              alt=""
              className="aspect-[4/3] w-full border border-sand object-cover"
              style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
            />
            <p className="mt-1.5 truncate text-right font-hand text-base leading-tight text-ink/70">
              {next.location.split(" · ")[1] ?? next.location}
            </p>
          </button>
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

      {/* 相邻明信片导航：鼠标点击 / 手指轻触 / 方向键都能翻篇 */}
      <nav aria-label="相邻明信片" className="mx-auto mt-8 flex w-full max-w-2xl items-stretch justify-center gap-3">
        {prev ? (
          <NavButton direction="prev" post={prev} onGo={() => flyTo("right")} disabled={leaving !== null} />
        ) : (
          <NavPlaceholder direction="prev" />
        )}
        {next ? (
          <NavButton direction="next" post={next} onGo={() => flyTo("left")} disabled={leaving !== null} />
        ) : (
          <NavPlaceholder direction="next" />
        )}
      </nav>

      <p className="mt-4 text-center font-hand text-xl text-ink/50">
        <span className="sm:hidden">slide the card</span>
        <span className="hidden sm:inline">← → 方向键也能翻篇</span>
      </p>

      {/* 全屏观看：整屏只剩明信片本体，卡片永远完整可见，文字在右列内部滚动 */}
      {fullscreen && (
        <div
          ref={fsLayer}
          role="dialog"
          aria-modal="true"
          aria-label={`全屏观看：${post.title}`}
          onClick={exitFullscreen}
          className="fixed inset-0 z-[55] flex flex-col bg-ink/80 p-3 backdrop-blur-sm sm:p-6"
        >
          {/* 工具条（深色底上用纸色文字） */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-wrap items-center justify-between gap-3 pb-3"
          >
            <p className="font-display text-xs tracking-[0.4em] text-paper/75">
              POSTCARD NO.{String(idx + 1).padStart(3, "0")} · {post.titleEn}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => flyTo("right")}
                disabled={!prev || leaving !== null}
                title={prev ? `上一张：${prev.title}` : "已是第一张"}
                className="min-h-11 border border-dashed border-paper/40 px-3 font-kai text-sm text-paper transition-colors hover:bg-paper/10 disabled:pointer-events-none disabled:opacity-35"
              >
                ← 上一张
              </button>
              <button
                type="button"
                onClick={() => flyTo("left")}
                disabled={!next || leaving !== null}
                title={next ? `下一张：${next.title}` : "已是最后一张"}
                className="min-h-11 border border-dashed border-paper/40 px-3 font-kai text-sm text-paper transition-colors hover:bg-paper/10 disabled:pointer-events-none disabled:opacity-35"
              >
                下一张 →
              </button>
              <button
                ref={fsExit}
                type="button"
                onClick={exitFullscreen}
                className="min-h-11 border border-dashed border-paper/70 px-3 font-kai text-sm text-paper transition-colors hover:bg-paper/15 focus-visible:bg-paper/15 focus-visible:outline-none"
              >
                退出全屏
                <span className="ml-1.5 font-display text-[10px] tracking-[0.2em] opacity-70">ESC</span>
              </button>
            </div>
          </div>

          {/* 卡片本体：撑满剩余高度，照片等比完整显示，正文列内部滚动 */}
          <div onClick={(e) => e.stopPropagation()} className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1">
            <div
              key={post.slug}
              style={cardStyle}
              className={`paper-shadow relative flex min-h-0 w-full bg-white p-4 sm:p-6 ${
                leaving ? "" : `card-arrive-${enterFrom}`
              }`}
            >
              <WashiTape color="#e89b50" rotate={-5} className="-top-3 left-10 z-10" />
              <WashiTape color="#2e596c" rotate={4} className="-top-3 right-10 z-10" />
              <div className="grid min-h-0 w-full grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-[minmax(0,1fr)]">
                <div className="flex min-h-0 flex-col items-center justify-center">
                  <div className="relative">
                    {/* ★ 必须有 aspect 保底：只写 w-auto/max-h 时，图片加载完成前盒子高度为 0，
                        邮票/邮戳/落款会叠在一起（和移动端正面塌陷是同一个坑） */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="aspect-[1080/760] max-h-[calc(100vh-15rem)] w-full border border-sand object-contain"
                      style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
                    />
                    <Stamp image={post.image} price={post.price} rotate={7} className="absolute right-2 top-2 w-20 shadow-md sm:w-24" />
                    <Postmark
                      city={post.location.split(" · ")[0]}
                      date={post.stampDate}
                      size={104}
                      className="absolute bottom-3 left-3 -rotate-12 mix-blend-multiply"
                    />
                  </div>
                  <p className="mt-3 text-center font-hand text-xl text-ink/70">
                    wish you were here — {post.location}
                  </p>
                </div>
                <div className="postcard-divider absolute left-1/2 top-4 hidden h-[calc(100%-2rem)] w-px md:block" />
                <div className="min-h-0 overflow-y-auto overscroll-contain pr-2">
                  <WritingContent post={post} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
