import { Link, createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "#/components/theme";
import { useArticlesQuery } from "#/server/rest-api/article";
import type { Article } from "#/server/rest-api/article";
import { useCategoriesQuery } from "#/server/rest-api/category";

export const Route = createFileRoute("/category/$id")({
  component: CategoryPage,
});

function Avatar({
  name,
  imageUrl,
  size = 28,
}: {
  name?: string | null;
  imageUrl?: string | null;
  size?: number;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name ?? "Correspondent"}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const trimmed = name?.trim();
  const initial = trimmed && trimmed.length > 0 ? trimmed[0] : "A";
  return (
    <div
      className="rounded-full border bg-muted/30 text-center text-xs font-semibold text-muted-foreground"
      style={{ width: size, height: size, lineHeight: `${size}px` }}
    >
      {initial}
    </div>
  );
}

function CategoryPage() {
  const { id } = Route.useParams();
  const categoryId = Number.parseInt(id, 10);

  const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: articles, isLoading: articlesLoading, error } = useArticlesQuery();

  const category = (categories ?? []).find((c) => c.id === id);
  const publishedArticles = (articles ?? [])
    .filter((a: Article) => a.status === "published")
    .filter((a: Article) => {
      if (typeof a.categoryId !== "number") return false;
      return a.categoryId === categoryId;
    });

  const correspondent = publishedArticles[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold hover:underline">
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
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Category</div>
            <h1 className="mt-1 text-2xl font-semibold">
              <span className="font-nepali">{category?.nameNp ?? "—"}</span>
            </h1>
            {category?.description ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to="/categories"
              className="rounded-md border bg-card px-3 py-2 hover:bg-muted/30"
            >
              Back
            </Link>
          </div>
        </div>

        {(categoriesLoading || articlesLoading) && !error ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Loading category news...
          </div>
        ) : error ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-destructive">
            {error.message}
          </div>
        ) : publishedArticles.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            No published articles found in this category yet.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="rounded-xl border bg-card p-4">
                <div className="text-xs font-semibold text-muted-foreground">
                  Correspondent
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Avatar
                    name={correspondent.authorName ?? null}
                    imageUrl={correspondent.authorImage ?? null}
                    size={48}
                  />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">
                      <span className="font-nepali">
                        {correspondent.authorName ?? "Admin"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Byline / correspondent
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border bg-card p-4">
                <div className="text-xs font-semibold text-muted-foreground">
                  More Categories
                </div>
                <div className="mt-3 space-y-2">
                  {(categories ?? []).map((c) => {
                    const active = c.id === id;
                    return (
                      <Link
                        key={c.id}
                        to={`/category/${c.id}`}
                        className={`block rounded-md border px-3 py-2 text-sm transition ${
                          active ? "bg-primary/10 border-primary/30" : "hover:bg-muted/30"
                        }`}
                      >
                        <span className="font-nepali">{c.nameNp}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>

            <section className="lg:col-span-8">
              <div className="space-y-3">
                {publishedArticles.map((a) => (
                  <Link
                    key={a.id}
                    to={`/article/${a.id}`}
                    className="group block rounded-xl border bg-card p-4 transition hover:bg-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      {a.coverImage ? (
                        <img
                          src={a.coverImage}
                          alt={a.coverImageAlt ?? a.title}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {a.isBreaking ? (
                            <span className="rounded-full border bg-muted/40 px-2 py-0.5">
                              Breaking
                            </span>
                          ) : null}
                          <span>
                            By{" "}
                            <span className="font-medium">
                              {a.authorName ?? "Admin"}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 line-clamp-2 text-lg font-semibold leading-tight">
                          <span className="font-nepali">{a.titleNp}</span>
                        </div>
                        {a.excerpt ? (
                          <div className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                            {a.excerpt}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

