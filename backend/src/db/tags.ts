import { pgTable, text, uuid, primaryKey } from "drizzle-orm/pg-core";
import { articles } from "./articles";

export const tags = pgTable("tags", {
    id: uuid("id").primaryKey().defaultRandom(), 

    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
});

export const articleTags = pgTable(
    "article_tags",
    {
        articleId: uuid("article_id") 
            .notNull()
            .references(() => articles.id, { onDelete: "cascade" }),

        tagId: uuid("tag_id") 
            .notNull()
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (t) => [
        primaryKey({ columns: [t.articleId, t.tagId] }),
    ],
);