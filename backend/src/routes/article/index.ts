import { Elysia, t } from 'elysia';
import db from '../../db';
import { createInsertSchema } from 'drizzle-typebox';
import { ArticleTable } from '../../db/articles';
import betterAuth from '../../macros/auth.macro';
import { eq } from 'drizzle-orm';

const ArticleSchema = createInsertSchema(ArticleTable.articles, {
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
        .insert(ArticleTable.articles)
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
      body: t.Omit(ArticleSchema,["id","createdAt","updatedAt","updatedAt"]),
      detail: {
        tags: ['Article'],
        summary: 'Create a new article',
      },
    }
  ).get(
    '/',
    async () => {
        const data = await db.select().from(ArticleTable.articles);
        return { data };  
    },
    {
        detail: {
            tags: ['Article'],
            summary: 'List all articles'
        }
    }
  )
  .get(
    '/breaking',
    async () => {
      const data = await db.select().from(ArticleTable.articles).where(eq(ArticleTable.articles.isBreaking, true));
      return { data };
    },
    {
      detail: {
        tags: ['Article'],
        summary: 'Get breaking articles'
      }
    }
  )
  .get(
    '/featured',
    async () => {
      const data = await db.select().from(ArticleTable.articles).where(eq(ArticleTable.articles.isFeatured, true));
      return { data };
    },
    {
      detail: {
        tags: ['Article'],
        summary: 'Get featured articles'
      }
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const article = await db.select().from(ArticleTable.articles).where(eq(ArticleTable.articles.id, params.id));
      return article[0];
    },
    {
      detail: {
        tags: ['Article'],
        summary: 'Get article by id'
      }
    }
  ).delete(
    '/:id',
    async ({ params }) => {
      await db.delete(ArticleTable.articles).where(eq(ArticleTable.articles.id, params.id));
      return { message: 'Article deleted successfully' };
    },
    {
      auth: true,
      detail: {
        tags: ['Article'],
        summary: 'Delete article by id'
      }
    }
  );