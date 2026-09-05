import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/lib/format";
import { trackOrder } from "@/lib/orders.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Wrapsy Gift Hampers" },
      {
        name: "description",
        content:
          "Enter your order number and email to see live status, delivery details and what's inside your hamper.",
      },
      { property: "og:title", content: "Track Your Order — Wrapsy" },
      { property: "og:description", content: "Live status for your gift hamper delivery." },
    ],
  }),
  component: TrackOrderPage,
});

type Result = Awaited<ReturnType<typeof trackOrder>> | null;

function TrackOrderPage() {
  const track = useServerFn(trackOrder);
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await track({ data: { orderNumber, email } });
      setResult(res);
      if (!res.found) setError("We couldn't find an order with those details.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const order = result?.found ? result.order : null;
  const currentIndex = order
    ? ORDER_STATUS_FLOW.indexOf(order.status as (typeof ORDER_STATUS_FLOW)[number])
    : -1;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-24 sm:pt-28 pb-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Track your order</h1>
      <p className="mt-2 text-muted-foreground">
        Use the order number from your confirmation along with the email you checked out with.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <Label htmlFor="order-number">Order number</Label>
          <Input
            id="order-number"
            required
            className="mt-2"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="GH…"
          />
        </div>
        <div>
          <Label htmlFor="order-email">Email</Label>
          <Input
            id="order-email"
            type="email"
            required
            className="mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Checking…" : "Track"}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {order && (
        <section className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="font-display text-xl font-semibold">{order.order_number}</p>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
            <p className="font-display text-2xl font-semibold">{formatINR(Number(order.total))}</p>
          </div>

          <ol className="mt-8 space-y-4">
            {ORDER_STATUS_FLOW.map((status, i) => {
              const done = currentIndex >= i;
              return (
                <li key={status} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border",
                      done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-4" /> : <span className="text-xs">{i + 1}</span>}
                  </span>
                  <span className={cn("text-sm", done ? "font-medium" : "text-muted-foreground")}>
                    {ORDER_STATUS_LABEL[status]}
                  </span>
                </li>
              );
            })}
          </ol>

          {order.tracking_number && (
            <p className="mt-6 text-sm">
              Tracking number: <span className="font-medium">{order.tracking_number}</span>
            </p>
          )}

          <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Delivering to</p>
            <p className="mt-1">
              {order.customer_name}, {order.address_line1}, {order.city}, {order.state} —{" "}
              {order.pincode}
            </p>
          </div>

          {result?.found && result.items.length > 0 && (
            <ul className="mt-6 space-y-3 border-t border-border pt-4">
              {result.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatINR(Number(item.line_total))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
