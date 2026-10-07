import { Link } from "react-router";

export default function SiteFooter() {
  return (
    <footer className="mt-16">
      <div className="airmail-stripes h-2.5 w-full" />
      <div className="bg-forest py-7 text-center">
        <p className="font-kai text-sm text-paper/85">© 2026 远山来信 · 把路过的风景，都寄给你</p>
        <div className="mt-3 flex justify-center gap-6 font-kai text-xs text-paper/60">
          <Link to="/posts" className="underline-offset-4 hover:underline">游记</Link>
          <Link to="/about" className="underline-offset-4 hover:underline">关于</Link>
          <Link to="/guestbook" className="underline-offset-4 hover:underline">留言板</Link>
        </div>
      </div>
    </footer>
  );
}
