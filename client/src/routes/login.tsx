import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEmailAndPasswordLogin } from "#/server/rest-api/auth";

import { ModeToggle } from "#/components/theme";

import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useEmailAndPasswordLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-semibold hover:underline">
            देश दृस्टि
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border bg-card p-6">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage articles.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setFormError(null);
              try {
                await loginMutation.mutateAsync({ email, password });
                navigate({ to: "/admin/articles" });
              } catch (err) {
                setFormError((err as Error).message);
              }
            }}
          >
            <label className="block">
              <span className="text-sm">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </label>

            {formError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {formError}
              </div>
            ) : null}

            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-5 text-xs text-muted-foreground">
            <span>Tip: Use the admin credentials set in your backend.</span>
          </div>
        </div>
      </main>
    </div>
  );
}

