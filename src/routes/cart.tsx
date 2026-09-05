import { Link, createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { estimateShipping, useCart } from "@/features/cart/cart-store";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Wrapsy Gift Hampers" },
      {
        name: "description",
        content: "Review your gift hampers, adjust quantities and continue to a fast guest checkout.",
      },
      { property: "og:title", content: "Your Cart — Wrapsy" },
      { property: "og:description", content: "Review your hampers before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const shipping = estimateShipping(subtotal);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:pt-28 pb-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-xl font-semibold">Your cart is empty</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our hampers or build one from scratch.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/shop">Shop hampers</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/build-a-hamper">Build your own</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 p-4">
                <img
                  src={item.image ?? "/images/hero-hamper.jpg"}
                  alt={item.name}
                  loading="lazy"
                  width={120}
                  height={120}
                  className="size-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.customization?.recipientName && (
                    <p className="text-xs text-muted-foreground">
                      For {item.customization.recipientName}
                    </p>
                  )}
                  {item.customization?.message && (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      “{item.customization.message}”
                    </p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">{formatINR(item.price)} each</p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="grid size-8 place-items-center"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="grid size-8 place-items-center"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.key)}
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <p className="font-medium">{formatINR(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-card p-5">
            <p className="font-display text-lg font-semibold">Order summary</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping (est.)</dt>
                <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Taxes and coupons are applied at checkout.
            </p>
            <Button asChild className="mt-5 w-full" size="lg">
              <Link to="/checkout">Checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
