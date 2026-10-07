import { useState } from "react";
import { Link, NavLink } from "react-router";

const links = [
  { to: "/", zh: "首页", en: "HOME" },
  { to: "/posts", zh: "游记", en: "POSTCARDS" },
  { to: "/calendar", zh: "日历", en: "CALENDAR" },
  { to: "/timeline", zh: "时间线", en: "TIMELINE" },
  { to: "/about", zh: "关于", en: "ABOUT" },
  { to: "/guestbook", zh: "留言板", en: "GUESTBOOK" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-3 sm:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-2.5">
          {/* 小邮票 logo */}
          <span className="stamp-perf inline-block bg-terra p-1" style={{ transform: "rotate(-6deg)" }}>
            <span className="block h-6 w-6 bg-[radial-gradient(circle_at_35%_35%,#e89b50,#c45c3e)]" />
          </span>
          <span className="leading-none">
            <span className="block font-kai text-xl text-forest">远山来信</span>
            <span className="block font-display text-[10px] tracking-[0.3em] text-ink/60">
              FARAWAY POST
            </span>
          </span>
        </Link>

        {/* 桌面导航：中文 + 英文小字堆叠 */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `group flex min-h-11 flex-col items-center justify-center leading-none ${
                  isActive ? "text-terra" : "text-forest"
                }`
              }
            >
              <span className="font-kai text-base">{l.zh}</span>
              <span className="mt-1 font-display text-[9px] tracking-[0.28em] opacity-60">
                {l.en}
              </span>
              <span className="mt-0.5 h-px w-0 bg-terra transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          aria-label="打开菜单"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-0.5 w-6 bg-forest transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-forest transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-forest transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* 移动端抽屉 */}
      {open && (
        <nav className="border-t border-dashed border-ink/20 bg-paper px-4 py-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex min-h-11 items-center justify-between border-b border-dashed border-ink/15 last:border-0 ${
                  isActive ? "text-terra" : "text-forest"
                }`
              }
            >
              <span className="font-kai text-lg">{l.zh}</span>
              <span className="font-display text-[10px] tracking-[0.28em] opacity-60">{l.en}</span>
            </NavLink>
          ))}
        </nav>
      )}

      {/* 航空信封条纹 */}
      <div className="airmail-stripes mt-3 h-2 w-full" />
    </header>
  );
}
