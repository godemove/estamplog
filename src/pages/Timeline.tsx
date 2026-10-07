import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { posts, postDateKey, type Post } from "@/data/posts";
import { diaryEntries, type DiaryEntry } from "@/data/diary";
import WashiTape from "@/components/postcard/WashiTape";
import Postmark from "@/components/postcard/Postmark";

/**
 * 一天 = 一个绳结。
 * 同一天的博文与日记挂在同一个结上 —— 以前它们各占一行、互不相认，
 * 读者看不出「这张照片就是那天写下的心情」。
 *
 * 撞日的呈现已定为「分开挂」：两张卡各自独立，中间一段麻绳 +「同一天的手记 ↴」
 * 把它们连成一组。曾另有一版「叠压」（便签用胶带贴在明信片下缘的留白上），
 * 已按用户要求废弃 —— 纵向更挤、版面更乱，别再改回去。
 */
type Day = { date: string; posts: Post[]; notes: DiaryEntry[] };

type KindFilter = "all" | "post" | "diary";

const MONTH_ZH = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const FILTERS: { key: KindFilter; zh: string; en: string; tilt: number }[] = [
  { key: "all", zh: "全部", en: "ALL", tilt: 0 },
  { key: "post", zh: "明信片", en: "POSTCARDS", tilt: -1.2 },
  { key: "diary", zh: "便签", en: "NOTES", tilt: 1.2 },
];

/**
 * 按日期归并数据。日期解析失败的博文收进 undated 单独露出，
 * 不再像以前那样被 slice(0,7) 变成空月份、然后静默消失。
 */
function buildTimeline() {
  const map = new Map<string, Day>();
  const undated: Post[] = [];

  for (const post of posts) {
    const key = postDateKey(post);
    if (!key) {
      undated.push(post);
      continue;
    }
    const day = map.get(key) ?? { date: key, posts: [], notes: [] };
    day.posts.push(post);
    map.set(key, day);
  }

  for (const note of diaryEntries) {
    const day = map.get(note.date) ?? { date: note.date, posts: [], notes: [] };
    day.notes.push(note);
    map.set(note.date, day);
  }

  // 新的在前；同一天内博文一定在便签之前（先看照片，再读那天的心情），
  // 而不是像以前那样靠 "diary" < "post" 的字典序碰运气
  const days = [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
  return { days, undated };
}

const { days: ALL_DAYS, undated: UNDATED_POSTS } = buildTimeline();

if (import.meta.env.DEV && UNDATED_POSTS.length > 0) {
  console.warn(
    `[Timeline] ${UNDATED_POSTS.length} 篇博文的 date 无法解析，已归入「日期待补」区：` +
      UNDATED_POSTS.map((p) => `${p.slug}（date: "${p.date}"）`).join("、"),
  );
}

/** 邮路两端由数据推导：最早年份做 SINCE，最新年月盖邮戳 —— 加博文自动跟随 */
const FIRST_DATE = ALL_DAYS.at(-1)?.date ?? "";
const LAST_DATE = ALL_DAYS[0]?.date ?? "";
const SINCE = FIRST_DATE ? `SINCE ${FIRST_DATE.slice(0, 4)}` : "SINCE —";
const STAMP_DATE = LAST_DATE ? `${LAST_DATE.slice(0, 4)}.${LAST_DATE.slice(5, 7)}` : "";

const POST_COUNT = ALL_DAYS.reduce((n, d) => n + d.posts.length, 0);
const NOTE_COUNT = ALL_DAYS.reduce((n, d) => n + d.notes.length, 0);

/** 明信片主卡：照片 + 邮票角 + 标题 */
function PostcardCard({ post, rotate }: { post: Post; rotate: number }) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="postcard-tilt paper-shadow group block bg-white p-3 pb-4"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="overflow-hidden border border-sand">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] group-active:scale-[1.02]"
          style={{ filter: "sepia(0.18) saturate(1.06) contrast(1.02)" }}
        />
      </div>
      <p className="mt-3 font-kai text-xl text-forest">{post.title}</p>
      <p className="mt-1 text-xs text-ink/60">
        {post.location} · {post.date}
      </p>
    </Link>
  );
}

/** 日记便签：点按去台历看那一天 */
function NoteCard({ note, left, rotate }: { note: DiaryEntry; left: boolean; rotate: number }) {
  return (
    <Link
      to={`/calendar?date=${note.date}`}
      aria-label={`${note.date} 的日记，去台历看这一天`}
      className="paper-shadow relative z-20 block bg-[#fdf3c9] p-5 transition-colors hover:bg-[#fdf0b5]"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <WashiTape color={left ? "#e89b50" : "#2e596c"} rotate={left ? -4 : 4} className="-top-3 left-1/2 -translate-x-1/2" />
      <p className="font-display text-[10px] tracking-[0.3em] text-ink/50">
        {note.date} {note.weather ? `· ${note.weather}` : ""}
      </p>
      <p className="mt-3 font-kai text-lg leading-loose text-ink/90">{note.text}</p>
      {note.place && <p className="mt-4 text-right font-kai text-sm text-ink/60">—— 于{note.place}</p>}
    </Link>
  );
}

/** 一天一行：绳结 / 移动端日期牌 / 挂在绳上的短线 + 卡片 */
function DayRow({ day, left, filter }: { day: Day; left: boolean; filter: KindFilter }) {
  const shownPosts = filter === "diary" ? [] : day.posts;
  const shownNotes = filter === "post" ? [] : day.notes;
  const both = shownPosts.length > 0 && shownNotes.length > 0;

  return (
    <div className={`relative flex ${left ? "sm:justify-start" : "sm:justify-end"}`}>
      {/* 挂点：移动端竖排日期牌（让麻绳承担叙事节奏，而不是只当装饰） */}
      <span className="absolute left-5 top-2 z-30 -translate-x-1/2 sm:hidden">
        <span className="paper-shadow-sm block bg-lace px-1.5 py-1 text-center font-display text-[10px] leading-tight tracking-[0.1em] text-ink/70">
          {day.date.slice(5, 7)}
          <br />
          {day.date.slice(8, 10)}
        </span>
      </span>
      {/* 绳结：桌面端 */}
      <span className="absolute left-1/2 top-6 z-30 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-terra bg-paper sm:block" />
      {/* 把卡片挂到绳上的短线 */}
      <span
        className={`absolute left-5 top-[25px] z-0 h-px w-7 bg-ink/25 sm:top-[29px] sm:w-10 ${
          left ? "sm:left-auto sm:right-1/2" : "sm:left-1/2"
        }`}
      />

      <div className={`relative z-10 ml-12 w-full sm:ml-0 sm:w-[calc(50%-2.5rem)] ${left ? "sm:mr-auto" : "sm:ml-auto"}`}>
        <div className="space-y-10">
          {shownPosts.map((post) => (
            <PostcardCard key={post.slug} post={post} rotate={left ? -1.5 : 1.5} />
          ))}
        </div>

        {/* 同一天：博文与便签分开挂，靠这段麻绳 + 手写标注连成一组 */}
        {both && (
          <div className="flex items-center gap-2 py-1 pl-1">
            <span className="h-7 w-px bg-ink/25" />
            <span className="font-hand text-base text-airmail">同一天的手记 ↴</span>
          </div>
        )}

        {shownNotes.length > 0 && (
          <div className={shownPosts.length > 0 ? "mt-2" : "space-y-10"}>
            {shownNotes.map((note) => (
              <NoteCard key={note.date + note.text} note={note} left={left} rotate={left ? 2 : -2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline() {
  const [filter, setFilter] = useState<KindFilter>("all");
  const [showTop, setShowTop] = useState(false);

  const visibleDays = useMemo(
    () =>
      ALL_DAYS.filter((d) =>
        filter === "post" ? d.posts.length > 0 : filter === "diary" ? d.notes.length > 0 : true,
      ),
    [filter],
  );

  // 按年月分组（日期无效的博文不在这里，单独在页尾露出）
  const groups = useMemo(() => {
    const map = new Map<string, Day[]>();
    for (const day of visibleDays) {
      const key = day.date.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(day);
    }
    return [...map.entries()];
  }, [visibleDays]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const countText =
    filter === "post" ? `${POST_COUNT} postcards` : filter === "diary" ? `${NOTE_COUNT} little notes` : `${POST_COUNT} postcards · ${NOTE_COUNT} little notes`;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-kai text-4xl text-forest sm:text-5xl">时间线</h1>
          <p className="mt-2 font-hand text-xl text-airmail sm:text-2xl">every card, every note, in order</p>
        </div>
        <Postmark city="邮路" date={STAMP_DATE} size={96} className="hidden shrink-0 -rotate-12 mix-blend-multiply sm:block" />
      </div>

      {/* 筛选：全部 / 明信片 / 便签 */}
      <div role="group" aria-label="筛选时间线内容" className="mt-8 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={`paper-shadow-sm flex min-h-11 items-center gap-2 px-4 font-kai transition-colors ${
                active ? "bg-forest text-paper" : "bg-lace text-forest hover:bg-sand/70"
              }`}
              style={{ transform: `rotate(${f.tilt}deg)` }}
            >
              <span className="text-base">{f.zh}</span>
              <span className="font-display text-[9px] tracking-[0.25em] opacity-70">{f.en}</span>
            </button>
          );
        })}
        <span className="ml-1 font-hand text-lg text-ink/50">{countText}</span>
      </div>

      <div className="relative mt-14">
        {/* 邮路主绳 */}
        <div
          className="absolute left-5 top-0 h-full w-px bg-ink/25 sm:left-1/2"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(92,74,61,0.35) 55%, transparent 45%)",
            backgroundSize: "1px 10px",
          }}
        />

        {groups.map(([ym, group], gi) => {
          const [y, m] = ym.split("-");
          return (
            <div key={ym} className="relative">
              {/* 月份牌：挂在绳上，滚动时钉在导航下方（长邮路才不会迷失在哪个月） */}
              <div className="sticky top-[4.75rem] z-40 mb-10 flex justify-start sm:justify-center">
                <div className="rounded-sm bg-paper px-2 py-1.5">
                  <div
                    className="paper-shadow-sm relative bg-forest px-5 py-2 text-paper"
                    style={{ transform: `rotate(${gi % 2 ? 1.5 : -1.5}deg)` }}
                  >
                    <span className="absolute -top-2 left-1/2 h-4 w-px -translate-x-1/2 bg-ink/40" />
                    <p className="font-display text-sm tracking-[0.25em]">
                      {y}.{m}
                    </p>
                    <p className="mt-0.5 text-center font-kai text-sm">{MONTH_ZH[Number(m) - 1]}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-12 pb-14">
                {group.map((day, i) => (
                  <DayRow key={day.date} day={day} left={i % 2 === 0} filter={filter} />
                ))}
              </div>
            </div>
          );
        })}

        {groups.length === 0 && (
          <p className="mt-10 text-center font-kai text-ink/60">这一类还没有内容。</p>
        )}

        {/* 邮路尽头：时间线新的在上，所以这里正好是最早的那一端 */}
        <div className="relative flex justify-start sm:justify-center">
          <p className="ml-12 font-hand text-xl text-ink/50 sm:ml-0">— the road goes on · {SINCE} —</p>
        </div>
      </div>

      {/* 日期解析失败的博文：显式露出，别静默丢失 */}
      {UNDATED_POSTS.length > 0 && (
        <div className="relative mt-12 ml-12 sm:ml-0">
          <p className="font-kai text-sm text-terra">日期待补 · undated</p>
          <p className="mt-1 font-hand text-base text-ink/50">fix the date field to pin them on the road</p>
          <div className="mt-4 space-y-3">
            {UNDATED_POSTS.map((p) => (
              <Link key={p.slug} to={`/post/${p.slug}`} className="paper-shadow-sm block bg-white p-3">
                <p className="font-kai text-base text-forest">{p.title}</p>
                <p className="mt-1 text-xs text-ink/60">
                  date「{p.date}」无法解析，请按「2026 年 8 月 12 日」补全
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="回到最新的明信片"
          className="stamp-perf paper-shadow fixed bottom-5 right-4 z-40 flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 bg-white text-forest transition-colors hover:bg-lace sm:right-6"
          style={{ transform: "rotate(-3deg)" }}
        >
          <span className="font-display text-lg leading-none">↑</span>
          <span className="font-kai text-[10px] leading-none">最新</span>
        </button>
      )}
    </div>
  );
}
