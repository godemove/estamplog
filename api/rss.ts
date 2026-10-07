import { posts, postDate, type Post } from "@/data/posts";

const SITE_TITLE = "远山来信";
const SITE_DESC = "明信片拟物风格的旅行博客 · 把路过的风景，都寄给你";
const AUTHOR = "远山";

/** XML 转义：标题/摘要里可能出现 & < > 引号 */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** RSS 2.0 的 pubDate 要 RFC 822；toUTCString() 正好给出 "Fri, 03 Jul 2026 00:00:00 GMT" */
function rfc822(d: Date): string {
  return d.toUTCString();
}

/**
 * 生成 RSS 2.0（8 篇游记明信片，按 posts 数组顺序 = 最新在前）。
 * 与前端共用 src/data/posts.ts，加一篇博文 feed 自动收录，不需要改这里。
 */
export function buildRss(origin: string): string {
  const items = posts
    .map((post) => ({ post, date: postDate(post) }))
    .filter((e): e is { post: Post; date: Date } => e.date !== null);

  const latest = items.reduce<Date | null>((acc, e) => (!acc || e.date > acc ? e.date : acc), null) ?? new Date();
  const feedUrl = `${origin}/rss.xml`;

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${esc(SITE_TITLE)}</title>`,
    `    <link>${esc(origin)}</link>`,
    `    <description>${esc(SITE_DESC)}</description>`,
    "    <language>zh-CN</language>",
    `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>`,
    "    <generator>远山来信 · handcrafted</generator>",
    `    <atom:link href="${esc(feedUrl)}" rel="self" type="application/rss+xml" />`,
  ];

  for (const { post, date } of items) {
    const url = `${origin}/post/${post.slug}`;
    lines.push(
      "    <item>",
      `      <title>${esc(post.title)}</title>`,
      `      <link>${esc(url)}</link>`,
      `      <guid isPermaLink="true">${esc(url)}</guid>`,
      `      <pubDate>${rfc822(date)}</pubDate>`,
      `      <description>${esc(post.excerpt)}</description>`,
      `      <dc:creator>${esc(AUTHOR)}</dc:creator>`,
      ...post.tags.map((t) => `      <category>${esc(t)}</category>`),
      "    </item>",
    );
  }

  lines.push("  </channel>", "</rss>", "");
  return lines.join("\n");
}
