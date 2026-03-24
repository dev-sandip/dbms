import { Link, createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "#/components/theme";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
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

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border bg-card p-6">
          <h1 className="text-2xl font-semibold">About</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            देश दृस्टि is a Nepali-focused news app. Nepali titles and article
            body content are rendered using the `font-nepali` Tailwind utility
            (Baloo 2).
          </p>

          <div className="mt-6 rounded-lg border bg-background p-4">
            <div className="text-sm font-semibold">Nepali example</div>
            <div className="mt-2 font-nepali text-base leading-7">
              देश दृस्टि मा स्वागत छ।
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
