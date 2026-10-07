import { useMemo } from "react";
import { Link } from "react-router";
import { posts, type Post } from "@/data/posts";
import { diaryEntries, type DiaryEntry } from "@/data/diary";
import WashiTape from "@/components/postcard/WashiTape";
import Postmark from "@/components/postcard/Postmark";

type TimelineItem =
  | { kind: "post"; date: string; post: Post }
  | { kind: "diary"; date: string; diary: DiaryEntry };

function postDateKey(post: Post): string {
  const m = post.date.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (!m) return "";
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

const MONTH_ZH = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

export default function Timeline() {
  const items = useMemo<TimelineItem[]>(() => {
    const list: TimelineItem[] = [
      ...posts.map((p) => ({ kind: "post" as const, date: postDateKey(p), post: p })),
      ...diaryEntries.map((d) => ({ kind: "diary" as const, date: d.date, diary: d })),
    ];
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, []);

  // 按年月分组
  const groups = useMemo(() => {
    const map = new Map<string, TimelineItem[]>();
    for (const item of items) {
      const key = item.date.slice(0, 7); // YYYY-MM
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-kai text-4xl text-forest sm:text-5xl">时间线</h1>
          <p className="mt-2 font-hand text-xl text-airmail sm:text-2xl">
            every card, every note, in order
          </p>
        </div>
        <Postmark city="邮路" date="SINCE 2025" size={96} className="hidden shrink-0 -rotate-12 mix-blend-multiply sm:block" />
      </div>

      <div className="relative mt-14">
        {/* 邮路主绳 */}
        <div className="absolute left-5 top-0 h-full w-px bg-ink/25 sm:left-1/2" style={{ backgroundImage: "linear-gradient(to bottom, rgba(92,74,61,0.35) 55%, transparent 45%)", backgroundSize: "1px 10px" }} />

        {groups.map(([ym, group], gi) => {
          const [y, m] = ym.split("-");
          return (
            <div key={ym} className="relative">
              {/* 月份牌：挂在绳上的标签 */}
              <div className="relative z-10 mb-10 flex justify-start sm:justify-center">
                <div
                  className="paper-shadow-sm relative bg-forest px-5 py-2 text-paper"
                  style={{ transform: `rotate(${gi % 2 ? 1.5 : -1.5}deg)` }}
                >
                  <span className="absolute -top-2 left-1/2 h-4 w-px -translate-x-1/2 bg-ink/40" />
                  <p className="font-display text-sm tracking-[0.25em]">{y}.{m}</p>
                  <p className="mt-0.5 text-center font-kai text-sm">{MONTH_ZH[Number(m) - 1]}</p>
                </div>
              </div>

              <div className="space-y-12 pb-14">
                {group.map((item, i) => {
                  const left = i % 2 === 0;
                  return (
                    <div key={item.date + item.kind} className={`relative flex ${left ? "sm:justify-start" : "sm:justify-end"}`}>
                      {/* 绳上的结 */}
                      <span className="absolute left-5 top-6 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-terra bg-paper sm:left-1/2" />

                      <div className={`ml-12 w-full sm:ml-0 sm:w-[calc(50%-2.5rem)] ${left ? "sm:mr-auto" : "sm:ml-auto"}`}>
                        {item.kind === "post" ? (
                          <Link
                            to={`/post/${item.post.slug}`}
                            className="postcard-tilt paper-shadow group block bg-white p-3 pb-4"
                            style={{ transform: `rotate(${left ? -1.5 : 1.5}deg)` }}
                          >
                            <div className="relative">
                              <div className="overflow-hidden border border-sand">
                                <img
                                  src={item.post.image}
                                  alt={item.post.title}
                                  loading="lazy"
                                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                  style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
                                />
                              </div>
                              <span className="stamp-perf absolute -right-2 -top-2 block w-10 bg-white p-1 shadow-sm" style={{ transform: "rotate(8deg)" }}>
                                <img src={item.post.image} alt="" className="block aspect-square w-full object-cover" style={{ filter: "sepia(0.22)" }} />
                              </span>
                            </div>
                            <p className="mt-3 font-kai text-xl text-forest">{item.post.title}</p>
                            <p className="mt-1 text-xs text-ink/60">{item.post.location} · {item.post.date}</p>
                          </Link>
                        ) : (
                          <div
                            className="paper-shadow relative bg-[#fdf3c9] p-5"
                            style={{ transform: `rotate(${left ? 1.5 : -1.5}deg)` }}
                          >
                            <WashiTape color={left ? "#e89b50" : "#2e596c"} rotate={left ? -4 : 4} className="-top-3 left-1/2 -translate-x-1/2" />
                            <p className="font-display text-[10px] tracking-[0.3em] text-ink/50">
                              {item.diary.date} {item.diary.weather ? `· ${item.diary.weather}` : ""}
                            </p>
                            <p className="mt-3 font-kai text-lg leading-loose text-ink/90">{item.diary.text}</p>
                            {item.diary.place && (
                              <p className="mt-4 text-right font-kai text-sm text-ink/60">—— 于{item.diary.place}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 邮路尽头 */}
        <div className="relative flex justify-start sm:justify-center">
          <p className="ml-12 font-hand text-xl text-ink/50 sm:ml-0">— the road goes on —</p>
        </div>
      </div>
    </div>
  );
}
