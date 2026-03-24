import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "#/constants/query-keys";

export type ArticleStatus = "draft" | "published" | "archived";

export type Article = {
  id: string;
  title: string;
  titleNp?: string | null;
  slug: string;
  excerpt?: string | null;
  body: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  authorId: string;
  authorName?: string | null;
  authorImage?: string | null;
  categoryId?: string | null;
  status: ArticleStatus;
  isFeatured: boolean;
  isBreaking: boolean;
  views: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateArticleInput = {
  title: string;
  titleNp: string;
  slug: string;
  excerpt?: string;
  body: string;
  coverImage?: string;
  coverImageAlt?: string;
  categoryId?: string | null;
  status: ArticleStatus;
  isFeatured: boolean;
  isBreaking: boolean;
  views: number;
  authorId: string;
};

function getBaseUrl() {
  const baseUrl = import.meta.env.VITE_PUBLIC_SERVER_URL;
  if (!baseUrl) throw new Error("Missing VITE_PUBLIC_SERVER_URL");
  return baseUrl;
}

async function apiFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = new URL(path, getBaseUrl()).toString();
  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(init?.body ? { "content-type": "application/json" } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

export function useArticlesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.article.list(),
    queryFn: async () => {
      const json = await apiFetchJson<{ data: Article[] }>("/article/");
      return json.data;
    },
  });
}

export function useBreakingArticlesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.article.breaking(),
    queryFn: async () => {
      const json = await apiFetchJson<{ data: Article[] }>("/article/breaking");
      return json.data;
    },
  });
}

export function useFeaturedArticlesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.article.featured(),
    queryFn: async () => {
      const json = await apiFetchJson<{ data: Article[] }>("/article/featured");
      return json.data;
    },
  });
}

export function useArticleByIdQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.article.detail(id),
    enabled: Boolean(id),
    queryFn: async () => {
      return apiFetchJson<Article>(`/article/${id}`);
    },
  });
}

export function useCreateArticleMutation() {
  return useMutation({
    mutationKey: ["article", "create"],
    mutationFn: async (input: CreateArticleInput) => {
      return apiFetchJson<Article>("/article/", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
  });
}

export function useDeleteArticleMutation() {
  return useMutation({
    mutationKey: ["article", "delete"],
    mutationFn: async (id: string) => {
      return apiFetchJson<{ message: string }>(`/article/${id}`, {
        method: "DELETE",
      });
    },
  });
}

