import { Link, createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "#/components/theme";
import { useCategoriesQuery } from "#/server/rest-api/category";

export const Route = createFileRoute("/categories/")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategoriesQuery();

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
        <div className="mb-6">
          <h1 className="text-balance text-2xl font-semibold">
            समाचारका प्रकार
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Nepali categories list (clean, professional layout).
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Loading categories...
          </div>
        ) : error ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-destructive">
            {error.message}
          </div>
        ) : (categories ?? []).length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            No categories yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(categories ?? []).map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="group rounded-xl border bg-card p-4 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">
                      Category
                    </div>
                    <div className="mt-1 font-nepali text-lg font-semibold leading-tight">
                      {c.nameNp}
                    </div>
                    {c.description ? (
                      <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {c.description}
                      </div>
                    ) : null}
                  </div>
                  {c.color ? (
                    <span
                      className="mt-1 inline-block h-4 w-4 rounded"
                      style={{ backgroundColor: c.color }}
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

