import {
    pgTable,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(), 

    name: text("name").notNull(),
    nameNp: text("name_np").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    color: text("color").default("#DC2626"),

    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

export const table = {
    categories
} as const;

export type Table = typeof table;