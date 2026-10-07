import { desc } from "drizzle-orm";
import { getDb } from "./connection";
import { guestbookEntries } from "@db/schema";

export async function listGuestbookEntries() {
  return getDb()
    .select()
    .from(guestbookEntries)
    .orderBy(desc(guestbookEntries.createdAt))
    .limit(100);
}

export async function createGuestbookEntry(input: {
  name: string;
  message: string;
  style: string;
}) {
  const db = getDb();
  await db.insert(guestbookEntries).values(input);
  const [row] = await db
    .select()
    .from(guestbookEntries)
    .orderBy(desc(guestbookEntries.id))
    .limit(1);
  return row;
}
