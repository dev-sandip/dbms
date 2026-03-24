import { Link, createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "#/components/theme";
import { useArticleByIdQuery } from "#/server/rest-api/article";

export const Route = createFileRoute("/article/$id")({
  component: ArticlePage,
});

function ArticlePage() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useArticleByIdQuery(id);

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
        {isLoading ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Loading article...
          </div>
        ) : error ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-destructive">
            {error.message}
          </div>
        ) : !data ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Article not found.
          </div>
        ) : (
          <article>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {data.authorImage ? (
                <img
                  src={data.authorImage}
                  alt={data.authorName ?? "Admin"}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted/30 text-sm font-semibold">
                  A
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate font-medium">
                  By{" "}
                  <span className="font-nepali">
                    {data.authorName ?? "Admin"}
                  </span>
                </div>
                <div className="text-xs">{data.slug}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {data.isBreaking ? (
                <span className="rounded-full border bg-muted/40 px-2 py-0.5">
                  Breaking
                </span>
              ) : null}
              {data.isFeatured ? (
                <span className="rounded-full border bg-muted/40 px-2 py-0.5">
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight">
              <span className="font-nepali">{data.titleNp || data.title}</span>
            </h1>

            {data.excerpt ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {data.excerpt}
              </p>
            ) : null}

            {data.coverImage ? (
              <img
                src={data.coverImage}
                alt={data.coverImageAlt ?? data.title}
                className="mt-6 w-full rounded-lg border object-cover"
              />
            ) : null}

            <div className="mt-6">
              <div className="prose max-w-none font-nepali dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: data.body }} />
              </div>
            </div>

            <div className="mt-8 text-xs text-muted-foreground">
              Views: {data.views}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

