import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminHeader } from "#/components/layout/admin-header";
import { Button } from "#/components/ui/button";
import { useCreateCategoryMutation } from "#/server/rest-api/category";
import type { CreateCategoryInput } from "#/server/rest-api/category";

export const Route = createFileRoute("/admin/categories/new")({
  component: AdminNewCategoryPage,
});

function AdminNewCategoryPage() {
  const navigate = useNavigate();
  const createMutation = useCreateCategoryMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [nameNp, setNameNp] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#DC2626");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Create Category</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Nepali text uses `font-nepali` for clean readability.
            </p>
          </div>
          <div className="text-sm">
            <Link
              to="/admin/categories"
              className="underline underline-offset-4"
            >
              Back to list
            </Link>
          </div>
        </div>

        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setFormError(null);
            try {
              const payload: CreateCategoryInput = {
                name,
                nameNp,
                slug,
                description: description.trim() ? description : undefined,
                color: color.trim() ? color : undefined,
              };
console.log("Creating category with payload", payload);
              await createMutation.mutateAsync(payload);
              navigate({ to: "/admin/categories" });
            } catch (err) {
              setFormError((err as Error).message);
            }
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm">Name (English)</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm">Name (Nepali)</span>
              <input
                value={nameNp}
                onChange={(e) => setNameNp(e.target.value)}
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm font-nepali outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm">Slug</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm">Description (optional)</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm">Color (optional)</span>
              <input
              type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-2  rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: color }}
                />
                Preview
              </div>
            </label>
          </div>

          {formError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {formError}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

