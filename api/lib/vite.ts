import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";

type App = Hono<{ Bindings: HttpBindings }>;

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");

  app.use("*", async (c, next) => {
    // 只放行真实存在的文件；目录或不存在的路径交给 SPA 回退
    const rel = decodeURIComponent(c.req.path).replace(/^\/+/, "");
    const filePath = path.resolve(distPath, rel || "index.html");
    if (rel && filePath.startsWith(distPath) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return serveStatic({ root: "./dist/public" })(c, next);
    }
    if (c.req.method === "GET" && (c.req.header("accept") ?? "").includes("text/html")) {
      return c.html(fs.readFileSync(path.join(distPath, "index.html"), "utf-8"));
    }
    return next();
  });

  app.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }
    const indexPath = path.resolve(distPath, "index.html");
    const content = fs.readFileSync(indexPath, "utf-8");
    return c.html(content);
  });
}
