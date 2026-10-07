import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { createGuestbookEntry, listGuestbookEntries } from "./queries/guestbook";

export const guestbookRouter = createRouter({
  list: publicQuery.query(() => listGuestbookEntries()),
  create: publicQuery
    .input(
      z.object({
        name: z.string().trim().min(1, "请留下署名").max(50, "署名太长啦"),
        message: z
          .string()
          .trim()
          .min(1, "明信片不能是空白的")
          .max(500, "明信片写不下这么多字（500 字以内）"),
        style: z.string().regex(/^[0-5]$/).default("0"),
      }),
    )
    .mutation(({ input }) => createGuestbookEntry(input)),
});
