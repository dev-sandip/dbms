import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AdminHeader } from "#/components/layout/admin-header";
import { useArticlesQuery, useDeleteArticleMutation } from "#/server/rest-api/article";
import { QUERY_KEYS } from "#/constants/query-keys";
import { querySessionOptions } from "#/server/rest-api/auth";

export const Route = createFileRoute("/admin/articles/")({
  component: AdminArticlesPage,
});

function AdminArticlesPage() {
  const queryClient = useQueryClient();
  const { data: session, isPending: authPending } = useQuery(querySessionOptions);

  const user = session?.user as { role?: string } | undefined;
  const { data: articles, isLoading, error } = useArticlesQuery();
  const deleteMutation = useDeleteArticleMutation();

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return (articles ?? [])
      .slice()
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  }, [articles]);

  useEffect(() => {
    setDeleteError(null);
  }, [articles]);

  if (authPending) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AdminHeader />
        <main className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Checking session...
          </div>
        </main>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AdminHeader />
        <main className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-lg border bg-card p-6 text-sm text-destructive">
            You are not authorized to manage articles.
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <Link to="/login" className="underline underline-offset-4">
              Go to login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Manage Articles</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, view, and delete articles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/articles/new"
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              New Article
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Loading articles...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-lg border bg-card p-6 text-sm text-destructive">
            {error.message}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg border bg-card">
            <div className="grid grid-cols-12 gap-2 border-b bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground">
              <div className="col-span-6">Title (Nepali)</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Featured</div>
              <div className="col-span-1">Breaking</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {sorted.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-12 gap-2 border-b px-4 py-3 text-sm"
              >
                <div className="col-span-6 min-w-0">
                  <div className="truncate font-medium">
                    <span className="font-nepali">{a.titleNp || a.title}</span>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {a.slug}
                  </div>
                </div>
                <div className="col-span-2 text-muted-foreground">{a.status}</div>
                <div className="col-span-1 text-muted-foreground">
                  {a.isFeatured ? "Yes" : "No"}
                </div>
                <div className="col-span-1 text-muted-foreground">
                  {a.isBreaking ? "Yes" : "No"}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Link
                    to={`/admin/articles/${a.id}`}
                    className="rounded-lg border bg-background px-2 py-1 text-xs hover:bg-muted"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg border bg-background px-2 py-1 text-xs hover:bg-muted"
                    disabled={deleteMutation.isPending}
                    onClick={async () => {
                      const ok = window.confirm(
                        "Delete this article? This cannot be undone."
                      );
                      if (!ok) return;
                      setDeleteError(null);
                      try {
                        await deleteMutation.mutateAsync(a.id);
                        queryClient.invalidateQueries({
                          queryKey: QUERY_KEYS.article.list(),
                        });
                      } catch (err) {
                        setDeleteError((err as Error).message);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {deleteError ? (
              <div className="px-4 py-3 text-sm text-destructive">{deleteError}</div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}

