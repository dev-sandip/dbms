import { Link, createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "#/components/theme";
import {
  useBreakingArticlesQuery,
  useFeaturedArticlesQuery,
} from "#/server/rest-api/article";
import { useCategoriesQuery } from "#/server/rest-api/category";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function formatNepaliDate(value?: string | null) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("ne-NP", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return value;
  }
}

function HomePage() {
  const { data: featured, isLoading: featuredLoading, error: featuredError } =
    useFeaturedArticlesQuery();
  const { data: breaking, isLoading: breakingLoading, error: breakingError } =
    useBreakingArticlesQuery();
  const { data: categories } = useCategoriesQuery();

  const featuredArr = featured ?? [];
  const featuredPublished = featuredArr.filter((a) => a.status === "published");
  const featuredMain = featuredPublished[0];
  const featuredSidebar = featuredPublished.slice(1, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-[220px]">
              <div className="text-xl font-semibold tracking-tight">
                देश दृस्टि
              </div>
              <div className="text-xs text-muted-foreground">
                Nepal's Voice Since 2024
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {formatNepaliDate(new Date().toISOString())}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <nav className="hidden items-center gap-4 md:flex">
                <Link to="/articles" className="text-sm hover:underline">
                  समाचार
                </Link>
                <Link to="/categories" className="text-sm hover:underline">
                  श्रेणी
                </Link>
              </nav>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <section className="border-b bg-[#c0392b]">
        {breakingLoading ? null : breakingError ? (
          <div className="px-4 py-2 text-sm text-white">
            ब्रेकिङ समाचार उपलब्ध छैन
          </div>
        ) : (
          (() => {
            const breakingPublished = (breaking ?? []).filter(
              (a) => a.status === "published"
            );
            const tickerItems = breakingPublished.slice(0, 10);
            const track = (
              <div className="ticker-track flex gap-6 py-0.5">
                {[...tickerItems, ...tickerItems].map((a, idx) => (
                  <div
                    key={`${a.id}-${idx}`}
                    className="flex items-center whitespace-nowrap"
                  >
                    <span className="font-nepali text-[12px] font-semibold text-white">
                      {a.titleNp || a.title}
                    </span>
                    <span className="mx-3 hidden text-[12px] text-white/70 sm:inline">
                      |
                    </span>
                  </div>
                ))}
              </div>
            );

            return (
              <div className="text-white">
                <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-1">
                  <span className="shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold">
                    ब्रेकिङ
                  </span>
                  <div className="relative flex-1 overflow-hidden">
                    {track}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">विशेष समाचार</h2>
            <Link to="/articles" className="text-sm underline underline-offset-4">
              सबै
            </Link>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {featuredLoading ? (
                <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                  Loading featured...
                </div>
              ) : featuredError ? (
                <div className="rounded-xl border bg-card p-6 text-sm text-destructive">
                  {featuredError.message}
                </div>
              ) : featuredPublished.length > 0 ? (
                <Link
                  to={`/article/${featuredMain.id}`}
                  className="group block overflow-hidden rounded-xl border bg-card transition hover:shadow-sm"
                >
                  <div className="border-t-4 border-[#c9962a] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#c9962a]/15 px-3 py-1 text-[11px] font-semibold text-[#c9962a]">
                        {(categories ?? []).find(
                          (c) => c.id === String(featuredMain.categoryId)
                        )?.nameNp ?? "श्रेणी"}
                      </span>
                      <div className="text-[11px] text-muted-foreground">
                        {formatNepaliDate(featuredMain.publishedAt ?? null)}
                      </div>
                    </div>

                    {featuredMain.coverImage ? (
                      <img
                        src={featuredMain.coverImage}
                        alt={featuredMain.coverImageAlt ?? featuredMain.title}
                        className="mt-3 h-52 w-full rounded-lg object-cover grayscale transition duration-300 group-hover:grayscale-0"
                      />
                    ) : null}

                    <div className="mt-4 font-nepali text-2xl font-semibold leading-tight">
                      {featuredMain.titleNp || featuredMain.title}
                    </div>
                    {featuredMain.excerpt ? (
                      <div className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {featuredMain.excerpt}
                      </div>
                    ) : null}
                  </div>
                </Link>
              ) : (
                <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                  No featured article yet.
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl border bg-card p-4">
                <div className="text-xs font-semibold text-muted-foreground">
                  सम्पादकीय छनोट
                </div>
                <div className="mt-3 space-y-3">
                  {featuredSidebar.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No featured sidebar items.
                    </div>
                  ) : (
                    featuredSidebar.map((a) => (
                      <Link
                        key={a.id}
                        to={`/article/${a.id}`}
                        className="group flex gap-3 rounded-lg border bg-background p-3 transition hover:bg-muted/20"
                      >
                        {a.coverImage ? (
                          <img
                            src={a.coverImage}
                            alt={a.coverImageAlt ?? a.title}
                            className="h-14 w-14 rounded-md object-cover grayscale transition duration-300 group-hover:grayscale-0"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-md border bg-muted/30" />
                        )}
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold text-[#c9962a]">
                            {(categories ?? []).find(
                              (c) => c.id === String(a.categoryId)
                            )?.nameNp ?? "श्रेणी"}
                          </div>
                          <div className="mt-1 line-clamp-2 font-nepali text-base font-semibold leading-tight">
                            {a.titleNp || a.title}
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">श्रेणीहरू</h2>
            <Link
              to="/categories"
              className="text-sm underline underline-offset-4"
            >
              सबै श्रेणी
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/articles"
              className="rounded-full border bg-background px-4 py-1 text-xs font-semibold hover:bg-muted/30"
            >
              सबै
            </Link>
            {(categories ?? []).map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="rounded-full border bg-background px-4 py-1 text-xs font-medium hover:bg-muted/30"
              >
                <span className="font-nepali">{c.nameNp}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
