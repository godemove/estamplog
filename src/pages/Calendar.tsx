import { useMemo, useState } from "react";
import { Link } from "react-router";
import { posts, postDateKey } from "@/data/posts";
import { diaryByDate } from "@/data/diary";
import WashiTape from "@/components/postcard/WashiTape";
import Postmark from "@/components/postcard/Postmark";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];
const MONTH_ZH = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const postByDate = new Map(posts.map((p) => [postDateKey(p), p]));

/** 格子缩略图用小尺寸，加载更快 */
function thumb(url: string) {
  return url.replace(/\/(\d+)\/(\d+)$/, "/240/180");
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based
  const [selected, setSelected] = useState<string | null>(null);

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    // 周一开头
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const list: (string | null)[] = [];
    for (let i = 0; i < offset; i++) list.push(null);
    for (let d = 1; d <= days; d++) list.push(`${year}-${pad(month + 1)}-${pad(d)}`);
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [year, month]);

  const flipMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(null);
  };

  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const selectedPost = selected ? postByDate.get(selected) : undefined;
  const selectedDiary = selected ? diaryByDate(selected) : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
      {/* ---------- 台历本体 ---------- */}
      <div className="paper-shadow relative bg-white">
        {/* 螺旋装订 */}
        <div className="relative flex h-10 items-center justify-center gap-4 rounded-t-sm bg-forest sm:h-12">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="block h-7 w-3 rounded-full border-2 border-sand/90 bg-transparent shadow-inner sm:h-8"
              style={{ transform: "translateY(-4px)" }}
            />
          ))}
        </div>

        {/* 月份牌 */}
        <div className="relative flex items-center justify-between border-b-2 border-dashed border-ink/20 px-4 py-4 sm:px-8 sm:py-6">
          <button
            type="button"
            onClick={() => flipMonth(-1)}
            aria-label="上个月"
            className="paper-shadow-sm flex min-h-11 min-w-11 items-center justify-center bg-lace font-kai text-xl text-forest transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ transform: "rotate(-2deg)" }}
          >
            ←
          </button>
          <div className="text-center">
            <p className="font-display text-5xl leading-none text-terra sm:text-7xl">
              {pad(month + 1)}
              <span className="ml-2 text-xl text-ink/50 sm:text-2xl">{year}</span>
            </p>
            <p className="mt-1 font-kai text-lg text-forest sm:text-xl">{MONTH_ZH[month]}</p>
          </div>
          <button
            type="button"
            onClick={() => flipMonth(1)}
            aria-label="下个月"
            className="paper-shadow-sm flex min-h-11 min-w-11 items-center justify-center bg-lace font-kai text-xl text-forest transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ transform: "rotate(2deg)" }}
          >
            →
          </button>
          <Postmark city="台历" date={`${year}.${pad(month + 1)}`} size={86} className="absolute -right-3 -top-2 hidden -rotate-12 mix-blend-multiply sm:block" />
        </div>

        {/* 星期行 */}
        <div className="grid grid-cols-7 border-b border-dashed border-ink/20">
          {WEEKDAYS.map((w, i) => (
            <p
              key={w}
              className={`py-2 text-center font-kai text-sm sm:text-base ${i >= 5 ? "text-terra" : "text-ink/60"}`}
            >
              {w}
            </p>
          ))}
        </div>

        {/* 日期格 */}
        <div className="grid grid-cols-7">
          {cells.map((key, i) => {
            if (!key) return <div key={`e${i}`} className="min-h-14 border-b border-r border-dashed border-ink/10 bg-lace/40 sm:min-h-24" />;
            const day = Number(key.slice(-2));
            const post = postByDate.get(key);
            const diary = diaryByDate(key);
            const isToday = key === todayKey;
            const isSelected = key === selected;
            const clickable = post || diary;
            return (
              <button
                key={key}
                type="button"
                disabled={!clickable}
                onClick={() => setSelected(isSelected ? null : key)}
                className={`relative min-h-14 border-b border-r border-dashed border-ink/10 p-1 text-left align-top transition-colors sm:min-h-24 sm:p-1.5 ${
                  clickable ? "cursor-pointer hover:bg-lace/60" : "cursor-default"
                } ${isSelected ? "bg-lace" : ""}`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center font-kai text-xs sm:h-6 sm:w-6 sm:text-sm ${
                    isToday ? "rounded-full bg-terra text-white" : "text-ink/70"
                  }`}
                >
                  {day}
                </span>

                {/* 迷你明信片 */}
                {post && (
                  <span className="mt-0.5 block w-4/5 bg-white p-0.5 shadow-sm" style={{ transform: `rotate(${day % 2 ? -3 : 2}deg)` }}>
                    <img
                      src={thumb(post.image)}
                      alt={post.title}
                      loading="lazy"
                      className="block aspect-[4/3] w-full object-cover"
                      style={{ filter: "sepia(0.18) saturate(1.06)" }}
                    />
                    <span className="stamp-perf absolute -right-1 -top-1 block w-3.5 bg-white p-px shadow-sm sm:w-4" style={{ transform: "rotate(8deg)" }}>
                      <span className="block aspect-square w-full bg-terra" />
                    </span>
                  </span>
                )}

                {/* 日记便签 */}
                {diary && (
                  <span
                    className={`block bg-[#fdf3c9] px-1 py-0.5 font-kai text-[10px] leading-tight text-ink/80 shadow-sm sm:text-xs ${
                      post ? "mt-1 w-3/5" : "mt-0.5 w-4/5"
                    }`}
                    style={{ transform: `rotate(${day % 2 ? 2 : -2}deg)` }}
                  >
                    <span className="hidden sm:inline">{diary.text.slice(0, 8)}…</span>
                    <span className="sm:hidden">✎</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- 选中日的展开：明信片 / 便签 ---------- */}
      {selected && (selectedPost || selectedDiary) && (
        <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center">
          {selectedPost && (
            <Link
              to={`/post/${selectedPost.slug}`}
              className="postcard-tilt paper-shadow block w-full max-w-xs bg-white p-3 pb-4"
              style={{ transform: "rotate(-2deg)" }}
            >
              <div className="overflow-hidden border border-sand">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="aspect-[4/3] w-full object-cover"
                  style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
                />
              </div>
              <p className="mt-3 font-kai text-xl text-forest">{selectedPost.title}</p>
              <p className="mt-1 text-xs text-ink/60">{selectedPost.location} · {selectedPost.date}</p>
              <p className="mt-2 font-hand text-lg text-airmail">read this postcard →</p>
            </Link>
          )}
          {selectedDiary && (
            <div className="paper-shadow relative w-full max-w-xs bg-[#fdf3c9] p-5" style={{ transform: "rotate(1.5deg)" }}>
              <WashiTape color="#2e596c" rotate={-4} className="-top-3 left-1/2 -translate-x-1/2" />
              <p className="font-display text-[10px] tracking-[0.3em] text-ink/50">
                {selected} {selectedDiary.weather ? `· ${selectedDiary.weather}` : ""}
              </p>
              <p className="mt-3 font-kai text-lg leading-loose text-ink/90">{selectedDiary.text}</p>
              {selectedDiary.place && (
                <p className="mt-4 text-right font-kai text-sm text-ink/60">—— 于{selectedDiary.place}</p>
              )}
            </div>
          )}
        </div>
      )}

      <p className="mt-10 text-center font-hand text-xl text-ink/60">
        postcards &amp; little notes, pinned on the calendar
      </p>
    </div>
  );
}
