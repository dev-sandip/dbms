import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminHeader } from "#/components/layout/admin-header";
import { useCategoriesQuery, useDeleteCategoryMutation } from "#/server/rest-api/category";
import { querySessionOptions } from "#/server/rest-api/auth";
import { QUERY_KEYS } from "#/constants/query-keys";

export const Route = createFileRoute("/admin/categories/")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const { data: session, isPending: authPending } = useQuery(querySessionOptions);
  const user = session?.user as { role?: string } | undefined;

  const { data: categories, isLoading, error } = useCategoriesQuery();
  const deleteMutation = useDeleteCategoryMutation();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return (categories ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  useEffect(() => {
    setDeleteError(null);
  }, [categories]);

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
            You are not authorized to manage categories.
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
            <h1 className="text-xl font-semibold">Manage Categories</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add categories and attach them to articles.
            </p>
          </div>
          <Link
            to="/admin/categories/new"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            New Category
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Loading categories...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-lg border bg-card p-6 text-sm text-destructive">
            {error.message}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg border bg-card">
            <div className="grid grid-cols-12 gap-2 border-b bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground">
              <div className="col-span-6">Name (Nepali)</div>
              <div className="col-span-4">Slug</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {sorted.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-12 gap-2 border-b px-4 py-3 text-sm"
              >
                <div className="col-span-6 min-w-0">
                  <div className="truncate">
                    <span className="font-nepali">{c.nameNp}</span>
                  </div>
                  {c.color ? (
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className="h-3 w-3 rounded"
                        style={{ backgroundColor: c.color }}
                      />
                      <span>{c.color}</span>
                    </div>
                  ) : null}
                </div>
                <div className="col-span-4 truncate text-muted-foreground">{c.slug}</div>
                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    className="rounded-lg border bg-background px-2 py-1 text-xs hover:bg-muted"
                    disabled={deleteMutation.isPending}
                    onClick={async () => {
                      const ok = window.confirm(
                        "Delete this category? Articles may still reference it."
                      );
                      if (!ok) return;
                      setDeleteError(null);
                      try {
                        await deleteMutation.mutateAsync(c.id);
                        queryClient.invalidateQueries({
                          queryKey: QUERY_KEYS.category.list(),
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

            {sorted.length === 0 ? (
              <div className="px-4 py-6 text-sm text-muted-foreground">
                No categories yet. Create one to attach to articles.
              </div>
            ) : null}

            {deleteError ? (
              <div className="px-4 py-3 text-sm text-destructive">{deleteError}</div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}

