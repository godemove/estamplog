import { createRouter, publicQuery } from "./middleware";
import { guestbookRouter } from "./guestbookRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  guestbook: guestbookRouter,
});

export type AppRouter = typeof appRouter;
