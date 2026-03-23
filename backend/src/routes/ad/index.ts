import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-typebox";
import Elysia, { t } from "elysia";
import db from "~/db";
import { AdsTable } from "~/db/ads";
import betterAuth from "~/macros/auth.macro";
const AdSchema = createInsertSchema(AdsTable.ads, {
    name: t.String(),
    type: t.Enum({
        image: "image",
        script: "script",
        html: "html"
    }),
    placement: t.Enum({
        header_leaderboard: "header_leaderboard",
        sidebar_top: "sidebar_top",
        sidebar_middle: "sidebar_middle",
        sidebar_bottom: "sidebar_bottom",
        in_article: "in_article",
        between_articles: "between_articles",
        footer_leaderboard: "footer_leaderboard",
        mobile_banner: "mobile_banner",
        category_top: "category_top"
    }),
    content: t.String(),
    linkUrl: t.Optional(t.String()),
    width: t.Optional(t.Integer()),
    isActive: t.Boolean(),
    startDate: t.Date(),
    endDate: t.Date(),
})
export const ad = new Elysia({ prefix: "/ad" })
    .use(betterAuth)
    .post("", ({ body, user }) => {
        const created = db.insert(AdsTable.ads).values(body).returning()
        return created;
    }, {
        auth: true,
        body: t.Omit(AdSchema,["id","createdAt","clicks","impressions"]),
        detail: {
            tags: ["Ad"],
            summary: "Create a new ad"
        }
    }).get("", async () => {
        const data = await db.select().from(AdsTable.ads);
        return { data };
    }, {
        detail: {
            tags: ["Ad"],
            summary: "Get all ads"
        }
    }).get("/:id", async ({ params }) => {
        const ad = await db.select().from(AdsTable.ads).where(eq(AdsTable.ads.id, params.id));
        return ad[0];
    }, {
        detail: {
            tags: ["Ad"],
            summary: "Get ad by ID"
        }
    }).delete("/:id", async ({ params }) => {
        await db.delete(AdsTable.ads).where(eq(AdsTable.ads.id, params.id));
        return { message: "Ad deleted" };
    }, {
        auth: true,
        detail: {
            tags: ["Ad"],
            summary: "Delete ad by ID"
        }
    })