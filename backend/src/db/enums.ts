import { pgEnum } from "drizzle-orm/pg-core";

export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "published",
  "archived",
]);
 
export const adPlacementEnum = pgEnum("ad_placement", [
  "header_leaderboard", // 728×90  — top of every page
  "sidebar_top",        // 300×250 — top of sidebar
  "sidebar_middle",     // 300×250 — mid sidebar
  "sidebar_bottom",     // 300×600 — bottom sidebar
  "in_article",         // 728×90  — after 3rd paragraph
  "between_articles",   // 728×90  — between article grid rows
  "footer_leaderboard", // 728×90  — above footer
  "mobile_banner",      // 320×50  — mobile only
  "category_top",       // 728×90  — top of category pages
]);
 
export const adTypeEnum = pgEnum("ad_type", ["image", "script", "html"]);