import { mysqlTable, serial, varchar, text, timestamp } from "drizzle-orm/mysql-core";

export const guestbookEntries = mysqlTable("guestbook_entries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  message: text("message").notNull(),
  // 0-5, picked client-side, decides the mini-postcard stamp/rotation style
  style: varchar("style", { length: 8 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
