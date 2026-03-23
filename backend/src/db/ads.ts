import { pgTable, text, boolean, integer, timestamp, index, uuid } from "drizzle-orm/pg-core";
import { adPlacementEnum, adTypeEnum } from "./enums";

export const ads = pgTable(
    "ads",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        placement: adPlacementEnum("placement").notNull(),
        type: adTypeEnum("type").notNull(),
        content: text("content").notNull(),
        linkUrl: text("link_url"),
        width: integer("width"),
        height: integer("height"),
        isActive: boolean("is_active").default(true).notNull(),
        startDate: timestamp("start_date", { withTimezone: true }),
        endDate: timestamp("end_date", { withTimezone: true }),
        impressions: integer("impressions").default(0).notNull(),
        clicks: integer("clicks").default(0).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("idx_ads_placement").on(t.placement),
        index("idx_ads_active").on(t.isActive),
        index("idx_ads_dates").on(t.startDate, t.endDate),
    ],
);

export const AdsTable = {
    ads
} as const;

export type AdsTable = typeof AdsTable;