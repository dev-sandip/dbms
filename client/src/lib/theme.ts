import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";

const postThemeValidator = z.union([z.literal("light"), z.literal("dark")]);
export type T = z.infer<typeof postThemeValidator>;
const storageKey = "_preferred-theme";

export const getThemeServerFn = createServerFn().handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  return (getCookie(storageKey) || "light") as T;
});

export const setThemeServerFn = createServerFn({ method: "POST" })
  .inputValidator(postThemeValidator)
  .handler(async ({ data }) => {
    const { setCookie } = await import("@tanstack/react-start/server");
    setCookie(storageKey, data);
  });