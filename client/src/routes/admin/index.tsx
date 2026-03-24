import { useEffect } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "#/components/layout/admin-header";
import { querySessionOptions } from "#/server/rest-api/auth";

export const Route = createFileRoute("/admin/")({
  component: AdminLanding,
});

function AdminLanding() {
  const navigate = useNavigate();
  const { data: session, isPending } = useQuery(querySessionOptions);
  const user = session?.user as { role?: string; email?: string } | undefined;

  useEffect(() => {
    if (isPending) return;
    if (user?.role === "admin") navigate({ to: "/admin/articles" });
  }, [isPending, navigate, user?.role]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        {isPending ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Checking session...
          </div>
        ) : user?.role === "admin" ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Redirecting to articles...
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-6">
            <h1 className="text-lg font-semibold">Admin access required</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You need an admin session to manage articles.
            </p>
            <div className="mt-4">
              <Link
                to="/login"
                className="text-sm font-medium underline underline-offset-4"
              >
                Go to login
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

