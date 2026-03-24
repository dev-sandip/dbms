import {
    pgTable,
    text,
    integer,
    boolean,
    timestamp,
    index,
    uuid
} from "drizzle-orm/pg-core";
import { articleStatusEnum } from "./enums";
import { user } from "./user";
import { categories } from "./categories";

export const articles = pgTable(
    "articles",
    {
        id: uuid("id").primaryKey().defaultRandom(), 

        title: text("title").notNull(),
        titleNp: text("title_np"),
        slug: text("slug").notNull().unique(),
        excerpt: text("excerpt"),
        body: text("body").notNull(),
        coverImage: text("cover_image"),
        coverImageAlt: text("cover_image_alt"),

        // ✅ KEEP AS STRING (text), as you requested
        authorId: text("author_id")
            .notNull()
            .references(() => user.id),

       
        categoryId: text("category_id")
            .references(() => categories.id),

        status: articleStatusEnum("status").default("draft").notNull(),
        isFeatured: boolean("is_featured").default(false).notNull(),
        isBreaking: boolean("is_breaking").default(false).notNull(),
        views: integer("views").default(0).notNull(),
        publishedAt: timestamp("published_at", { withTimezone: true }),

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("idx_articles_slug").on(t.slug),
        index("idx_articles_status").on(t.status),
        index("idx_articles_category").on(t.categoryId),
        index("idx_articles_featured").on(t.isFeatured),
        index("idx_articles_breaking").on(t.isBreaking),
        index("idx_articles_published_at").on(t.publishedAt),
    ],
);

export const ArticleTable = {
    articles
} as const;

export type ArticleTable = typeof ArticleTable;