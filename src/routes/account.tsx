import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — Wrapsy Gift Hampers" },
      {
        name: "description",
        content:
          "Sign in to save your details, keep your wishlist across devices and revisit your gift hamper orders.",
      },
      { property: "og:title", content: "Your Account — Wrapsy" },
      { property: "og:description", content: "Sign in or create your Wrapsy account." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handle = async (mode: "signin" | "signup", e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/account` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return <div className="mx-auto max-w-md px-4 py-20 text-muted-foreground">Loading…</div>;
  }

  if (user) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pt-24 sm:pt-28 pb-16 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Your account</h1>
        <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/track-order">Track an order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/wishlist">Your wishlist</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
              toast.success("Signed out");
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-24 sm:pt-28 pb-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Your account</h1>
      <p className="mt-2 text-muted-foreground">
        Optional — you can always check out as a guest.
      </p>

      <Tabs defaultValue="signin" className="mt-8">
        <TabsList className="w-full">
          <TabsTrigger value="signin" className="flex-1">Sign in</TabsTrigger>
          <TabsTrigger value="signup" className="flex-1">Create account</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form onSubmit={(e) => handle("signin", e)} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="si-email">Email</Label>
              <Input id="si-email" name="email" type="email" required className="mt-2" />
            </div>
            <div>
              <Label htmlFor="si-password">Password</Label>
              <Input id="si-password" name="password" type="password" required className="mt-2" />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              Sign in
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={(e) => handle("signup", e)} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="su-email">Email</Label>
              <Input id="su-email" name="email" type="email" required className="mt-2" />
            </div>
            <div>
              <Label htmlFor="su-password">Password</Label>
              <Input
                id="su-password"
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-2"
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              Create account
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
