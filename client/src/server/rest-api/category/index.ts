import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "#/constants/query-keys";

export type Category = {
  id: string;
  name: string;
  nameNp: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  createdAt?: string;
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

export function useCategoriesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.category.list(),
    queryFn: async () => {
      const json = await apiFetchJson<{ data: Category[] }>("/category/");
      return json.data;
    },
  });
}

export type CreateCategoryInput = {
  name: string;
  nameNp: string;
  slug: string;
  description?: string;
  color?: string;
};

export function useCreateCategoryMutation() {
  return useMutation({
    mutationKey: ["category", "create"],
    mutationFn: async (input: CreateCategoryInput) => {
      const payload = {
        name: input.name,
        nameNp: input.nameNp,
        slug: input.slug,
        description: input.description?.trim() ? input.description : undefined,
        color: input.color?.trim() ? input.color : undefined,
      };

      return apiFetchJson<{ data: Category[] }>("/category/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  });
}

export function useDeleteCategoryMutation() {
  return useMutation({
    mutationKey: ["category", "delete"],
    mutationFn: async (id: string) => {
      return apiFetchJson<{ data?: unknown }>(`/category/${id}`, {
        method: "DELETE",
      });
    },
  });
}

