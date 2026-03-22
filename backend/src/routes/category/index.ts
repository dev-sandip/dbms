import { Elysia, t } from 'elysia';
import db from '../../db';
import { CategoryTable } from '../../db/categories';
import { createInsertSchema } from 'drizzle-typebox';
import { eq } from 'drizzle-orm';
import betterAuth from '../../macros/auth.macro';

const CategorySchema = createInsertSchema(CategoryTable.categories, {
  name: t.String(),
  nameNp: t.String(),
  slug: t.String(),
  description: t.Optional(t.String()),
  color: t.Optional(t.String())
})

export const category = new Elysia({ prefix: '/category' })
.use(betterAuth)
  .get(
    '/',
    async () => {
      const data = await db.select().from(CategoryTable.categories);
      return { data };
    },
    {
      detail: {
        tags: ['Category'],
        summary: 'List all categories'
      }
    }
  )
  .post(
    '/',
    async ({ body }) => {
     try{
       const result = await db
        .insert(CategoryTable.categories)
        .values(body)
        .returning();  
        return { data: result };
     }    catch(error){
        console.error('Error inserting category:', error);  
     }                           
      
    },
    {
      
      body: t.Omit(CategorySchema,['id',"createdAt"]),
      auth:true,
      detail: {
        tags: ['Category'],
        summary: 'Create a new category'
      }
    }
    
  ).put(
    '/:id',
    async ({ body, params }) => {
        const id = params.id;
      const result = await db
        .update(CategoryTable.categories)
        .set(body)
        .where(eq(CategoryTable.categories.id, id))
        .returning();
      return { data: result };
    },
    {
      body: t.Omit(CategorySchema,["createdAt"]),
      auth:true,
      detail: {
        tags: ['Category'],
        summary: 'Update a category by ID'
      }     
    }).delete('/:id', async ({ params }) => {
    const id = params.id;
    const result = await db
      .delete(CategoryTable.categories)
      .where(eq(CategoryTable.categories.id, params.id))
      .returning();
    return { data: result };
  }, {
    auth:true,
    detail: {
      tags: ['Category'],
      summary: 'Delete a category by ID'
    }     
  });