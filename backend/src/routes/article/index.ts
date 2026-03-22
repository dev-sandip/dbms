import { Elysia, t } from 'elysia';
import db from '../../db';
import { createInsertSchema } from 'drizzle-typebox';
import { table } from '../../db/articles';
import betterAuth from '../../macros/auth.macro';

const ArticleSchema = createInsertSchema(table.articles, {
  title: t.String(),
  titleNp: t.String(),
  slug: t.String(),
  excerpt: t.Optional(t.String()),
  body: t.String(),
  coverImage: t.Optional(t.String()),
  coverImageAlt: t.Optional(t.String()),
  authorId: t.String(),
  categoryId: t.Optional(t.Integer()),
  status: t.Enum({
    draft: 'draft',
    published: 'published',
    archived: 'archived'
  }),
  isFeatured: t.Boolean(),
  isBreaking: t.Boolean(),
  views: t.Integer(),
  
});

export const article = new Elysia({ prefix: '/article' })
  .use(betterAuth)
  .post(
    '/',
    async ({ body, user }) => {
      const created = await db
        .insert(table.articles)
        .values({
          ...body,
          authorId: user.id,
          publishedAt: new Date(),
        })
        .returning()
        .then((r) => r[0]);

      return created;
    },
    {
      auth: true,
      body: ArticleSchema,
      detail: {
        tags: ['Article'],
        summary: 'Create a new article',
      },
    }
  ).get(
    '/',
    async () => {
        const data = await db.select().from(table.articles);
        return { data };  
    },
    {
        detail: {
            tags: ['Article'],
            summary: 'List all articles'
        }
    }
  )
  
  
  
  ;