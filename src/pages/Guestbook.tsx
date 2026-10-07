import { useState } from "react";
import { trpc } from "@/providers/trpc";
import WashiTape from "@/components/postcard/WashiTape";
import Postmark from "@/components/postcard/Postmark";

const stampColors = ["#c45c3e", "#2e596c", "#1a3d2e", "#e89b50", "#007dda", "#8a5a3b"];
const rotations = [-2, 1.5, -1, 2.5, -2.5, 1];

function formatDate(d: Date | string) {
  const date = new Date(d);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function Guestbook() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState("0");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const utils = trpc.useUtils();
  const list = trpc.guestbook.list.useQuery();
  const create = trpc.guestbook.create.useMutation({
    onSuccess: () => {
      utils.guestbook.list.invalidate();
      setSent(true);
      setName("");
      setMessage("");
      setError("");
      setTimeout(() => setSent(false), 4000);
    },
    onError: (e) => setError(e.message || "投递失败，请稍后再试"),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    create.mutate({ name, message, style });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <p className="font-display text-xs tracking-[0.4em] text-terra">THE MAILBOX · 墙上的旧信箱</p>
      <h1 className="mt-3 font-kai text-4xl text-forest sm:text-5xl">留言板</h1>
      <p className="mt-3 font-hand text-xl text-airmail">drop a postcard in the mailbox</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        {/* ---------- 左：写明信片 ---------- */}
        <form onSubmit={submit} className="paper-shadow relative h-fit bg-white p-5 sm:p-7" style={{ transform: "rotate(-1deg)" }}>
          <WashiTape color="#e89b50" rotate={-5} className="-top-3 left-1/2 -translate-x-1/2" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-display text-[10px] tracking-[0.3em] text-ink/50">POST CARD · 航空件</p>
              <p className="mt-1 whitespace-nowrap font-kai text-lg text-forest">寄给：远山 收</p>
            </div>
            {/* 选邮票颜色 */}
            <div className="sm:text-right">
              <p className="text-xs text-ink/60">选一枚邮票</p>
              <div className="mt-2 flex gap-1.5">
                {stampColors.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`邮票颜色 ${i + 1}`}
                    onClick={() => setStyle(String(i))}
                    className={`stamp-perf h-8 w-8 p-1 transition-transform ${style === String(i) ? "scale-110" : "opacity-60 hover:opacity-100"}`}
                    style={{ background: "#fff", boxShadow: style === String(i) ? `0 0 0 2px ${c}` : "none" }}
                  >
                    <span className="block h-full w-full" style={{ background: c }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="mt-6 block">
            <span className="font-kai text-sm text-ink/70">署名</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="你的称呼，比如「路过的旅人」"
              className="mt-1.5 min-h-11 w-full border-b-2 border-dashed border-ink/30 bg-transparent px-1 font-kai text-lg text-forest outline-none placeholder:text-ink/35 focus:border-terra"
            />
          </label>

          <label className="mt-5 block">
            <span className="font-kai text-sm text-ink/70">正文（500 字以内）</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={6}
              placeholder="写点什么吧——今天的天气、想去的地方、或者只是问声好。"
              className="letter-lines mt-1.5 w-full resize-none bg-transparent px-1 font-kai text-lg text-forest outline-none placeholder:text-ink/35"
            />
          </label>

          {error && <p className="mt-3 font-kai text-sm text-terra">{error}</p>}
          {sent && (
            <p className="stamp-in mt-3 inline-block font-kai text-airmail">
              ✓ 已盖邮戳，投递成功！
            </p>
          )}

          <button
            type="submit"
            disabled={create.isPending}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-terra font-kai text-lg text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
          >
            {create.isPending ? "正在盖邮戳……" : "盖上邮戳 · 寄出"}
          </button>
        </form>

        {/* ---------- 右：信箱里的明信片 ---------- */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-kai text-2xl text-forest">
              信箱里已有 {list.data?.length ?? "…"} 封来信
            </h2>
            <Postmark city="信箱" date="OPEN" size={72} className="-rotate-12 mix-blend-multiply" />
          </div>

          {list.isLoading && (
            <p className="mt-10 text-center font-kai text-ink/60">邮差正在路上……</p>
          )}
          {list.isError && (
            <p className="mt-10 text-center font-kai text-terra">信箱暂时打不开，请稍后再来看看。</p>
          )}
          {list.data?.length === 0 && (
            <div className="paper-shadow-sm mt-8 bg-white p-10 text-center" style={{ transform: "rotate(1deg)" }}>
              <p className="font-kai text-xl text-forest">信箱还是空的</p>
              <p className="mt-2 text-sm text-ink/70">第一张明信片，等你来寄。</p>
            </div>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {list.data?.map((entry, i) => {
              const color = stampColors[Number(entry.style) % stampColors.length] ?? stampColors[0];
              return (
                <div
                  key={entry.id}
                  className="paper-shadow-sm relative bg-white p-4 pt-5"
                  style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}
                >
                  {/* 小邮票 */}
                  <span className="stamp-perf absolute -right-2 -top-3 block w-10 bg-white p-1 shadow-sm" style={{ transform: "rotate(8deg)" }}>
                    <span className="block aspect-square w-full" style={{ background: color }} />
                  </span>
                  <p className="whitespace-pre-wrap font-kai text-[15px] leading-relaxed text-ink/90">
                    {entry.message}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/20 pt-3 text-xs text-ink/60">
                    <span className="font-kai text-sm text-airmail">—— {entry.name}</span>
                    <span className="font-display tracking-[0.15em]">{formatDate(entry.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
