import { posts } from "@/data/posts";
import Stamp from "@/components/postcard/Stamp";
import Postmark from "@/components/postcard/Postmark";
import WashiTape from "@/components/postcard/WashiTape";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-6 pt-12 sm:px-6 sm:pt-16">
      {/* 关于我 = 一张明信片 */}
      <div className="paper-shadow relative bg-white">
        <WashiTape color="#e89b50" rotate={-5} className="-top-3 left-10 z-10" />
        <WashiTape color="#2e596c" rotate={4} className="-top-3 right-10 z-10" />
        <div className="grid md:grid-cols-2">
          {/* 正面：照片 */}
          <div className="relative p-5 sm:p-8">
            <div className="overflow-hidden border border-sand">
              <img
                src="https://picsum.photos/id/1043/720/840"
                alt="山坳里的村落"
                className="w-full object-cover"
                style={{ filter: "sepia(0.22) saturate(1.05)" }}
              />
            </div>
            <Stamp image="https://picsum.photos/id/1043/720/840" price="1.20" rotate={7} className="absolute right-2 top-2 w-20 shadow-md sm:w-24" />
            <Postmark city="寄信人" date="VERIFIED" size={104} className="absolute bottom-3 left-3 -rotate-12 mix-blend-multiply" />
            <p className="mt-4 text-center font-hand text-xl text-ink/70">hi, i'm the one behind the stamps</p>
          </div>

          {/* 中缝虚线 */}
          <div className="postcard-divider absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px md:block" />

          {/* 背面：三行字 */}
          <div className="relative border-t border-dashed border-ink/25 p-5 sm:p-8 md:border-t-0">
            <p className="font-display text-[10px] tracking-[0.3em] text-ink/50">THE SENDER · 寄信人</p>
            <h1 className="mt-2 font-kai text-3xl text-forest sm:text-4xl">远山</h1>
            <div className="mt-6 space-y-5 text-[15px] leading-loose text-ink/90">
              <p>白天对着屏幕，假期对着风景。</p>
              <p>每到一个地方，就寄出一张明信片——正面是当场拍下的照片，背面是当晚写下的字。</p>
              <p>这个博客，就是我的投递箱。</p>
            </div>
            <p className="mt-10 text-right font-hand text-2xl text-airmail">— 远山</p>
          </div>
        </div>
      </div>

      {/* 邮戳墙：去过的地方，各盖一个章 */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
        {posts.map((p, i) => (
          <Postmark
            key={p.slug}
            city={p.location.split(" · ")[0]}
            date={p.stampDate}
            size={92}
            color={["#2e596c", "#c45c3e", "#1a3d2e"][i % 3]}
            className={`${i % 2 ? "rotate-6" : "-rotate-12"} mix-blend-multiply`}
          />
        ))}
      </div>
    </div>
  );
}
