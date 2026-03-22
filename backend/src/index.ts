import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import betterAuth from "./macros/auth.macro";
import {  openapi } from '@elysiajs/openapi';
import { category } from "./routes/category";
import { article } from "./routes/article";
const app = new Elysia()
  .get(
    "/",

    () => {
      return {

        authDocs: "For auth docs visit /api/auth/reference",
        docs: "For api docs visit /openapi"
      }
    },
  )
  .use(betterAuth)
  .use(category)
  .use(article)
  .use(openapi())
  .use(
    cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  ).listen(process.env.PORT ?? 3000) 
 

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);