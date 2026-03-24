import { Link, useNavigate } from "@tanstack/react-router";
import { ModeToggle } from "#/components/theme";
import { useLogout, useUser } from "#/server/rest-api/auth";

export function AdminHeader() {
  const navigate = useNavigate();
  const user = useUser();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-sm font-semibold hover:underline">
            देश दृस्टि Admin
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link to="/admin/articles" className="text-sm hover:underline">
              Articles
            </Link>
            <Link
              to="/admin/articles/new"
              className="text-sm hover:underline"
            >
              New Article
            </Link>
            <Link to="/admin/categories" className="text-sm hover:underline">
              Categories
            </Link>
            <Link
              to="/admin/categories/new"
              className="text-sm hover:underline"
            >
              New Category
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {user.email}
            </span>
          ) : null}
          <ModeToggle />
          <button
            type="button"
            className="rounded border bg-background px-2 py-1 text-xs hover:bg-muted"
            onClick={() => {
              logout.mutate(undefined, {
                onSuccess: () => navigate({ to: "/login" }),
              });
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

