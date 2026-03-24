import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ModeToggle } from "#/components/theme";
import { useArticlesQuery } from "#/server/rest-api/article";
import { useCategoriesQuery } from "#/server/rest-api/category";

export const Route = createFileRoute("/articles")({
  component: ArticlesPage,
});

function ArticlesPage() {
  const { data: articles, isLoading, error } = useArticlesQuery();

  const { data: categories } = useCategoriesQuery();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

const published = useMemo(() => {
  const base = (articles ?? []).filter((a) => a.status === "published");
  if (!selectedCategoryId) return base;

  return base.filter((a) => a.categoryId === selectedCategoryId);
}, [articles, selectedCategoryId]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm font-semibold hover:underline"
            >
              देश दृस्टि
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              <Link to="/articles" className="text-sm hover:underline">
                Articles
              </Link>
              <Link to="/categories" className="text-sm hover:underline">
                Categories
              </Link>
            </nav>
          </div>

          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-balance text-2xl font-semibold">
            News Articles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Professional clean layout with Nepali typography for Nepali content.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="text-sm font-medium">Category:</div>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring font-nepali"
          >
            <option value="" className="font-sans">
              All categories
            </option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameNp}
              </option>
            ))}
          </select>

          {selectedCategoryId ? (
            <Link
              to={`/category/${selectedCategoryId}`}
              className="rounded-lg border bg-card px-3 py-2 text-sm hover:bg-muted/30"
            >
              Open
            </Link>
          ) : null}
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Loading articles...
          </div>
        ) : error ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-destructive">
            {error.message}
          </div>
        ) : published.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            No published articles yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {published.map((a) => (
              <Link
                key={a.id}
                to={`/article/${a.id}`}
                className="group rounded-lg border bg-card p-4 transition hover:shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {a.authorImage ? (
                        <img
                          src={a.authorImage}
                          alt={a.authorName ?? "Admin"}
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border bg-muted/30 text-[10px]">
                          A
                        </span>
                      )}
                      <span className="truncate">
                        By{" "}
                        <span className="font-medium">
                          {a.authorName ?? "Admin"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-medium leading-tight">
                        <span className="font-nepali text-base">
                          {a.titleNp || a.title}
                        </span>
                      </h2>
                    </div>

                    {a.excerpt ? (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {a.excerpt}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {a.isBreaking ? (
                        <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-[11px]">
                          Breaking
                        </span>
                      ) : null}
                      {a.isFeatured ? (
                        <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-[11px]">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {a.coverImage ? (
                    <img
                      src={a.coverImage}
                      alt={a.coverImageAlt ?? a.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

