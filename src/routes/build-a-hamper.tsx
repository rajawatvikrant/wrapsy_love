import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/features/cart/cart-store";
import { fetchHamperComponents } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const builderQuery = queryOptions({
  queryKey: ["hamper-components"],
  queryFn: fetchHamperComponents,
});

export const Route = createFileRoute("/build-a-hamper")({
  head: () => ({
    meta: [
      { title: "Build Your Own Gift Hamper — Wrapsy" },
      {
        name: "description",
        content:
          "Choose a basket, pick chocolates, candles, teas and treats, add a handwritten note and we'll pack your custom hamper the same day.",
      },
      { property: "og:title", content: "Build Your Own Gift Hamper — Wrapsy" },
      {
        property: "og:description",
        content: "A custom hamper studio: pick every item and see live pricing.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(builderQuery),
  component: Builder,
});

const KIND_LABEL: Record<string, string> = {
  basket: "Choose a basket",
  chocolate: "Chocolates & sweets",
  snack: "Snacks & gourmet",
  beverage: "Teas & beverages",
  wellness: "Wellness & self-care",
  decor: "Candles & decor",
  extra: "Finishing touches",
};

function Builder() {
  const { data: components } = useSuspenseQuery(builderQuery);
  const { addItem } = useCart();
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, typeof components>();
    for (const c of components) {
      const list = map.get(c.kind) ?? [];
      list.push(c);
      map.set(c.kind, list);
    }
    return [...map.entries()];
  }, [components]);

  const chosen = components.filter((c) => selected.includes(c.id));
  const total = chosen.reduce((sum, c) => sum + Number(c.price), 0);
  const hasBasket = chosen.some((c) => c.kind === "basket");

  const toggle = (id: string, kind: string) =>
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (kind === "basket") {
        const otherBaskets = components.filter((c) => c.kind === "basket").map((c) => c.id);
        return [...prev.filter((p) => !otherBaskets.includes(p)), id];
      }
      return [...prev, id];
    });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-24 sm:pt-28 pb-14 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold">Build your own hamper</h1>
        <p className="mt-3 text-muted-foreground">
          Start with a basket, add what you love, and finish with a handwritten note. Pricing
          updates as you go — final pricing is confirmed on our side at checkout.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          {grouped.map(([kind, items]) => (
            <section key={kind}>
              <h2 className="font-display text-xl font-semibold">{KIND_LABEL[kind] ?? kind}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((c) => {
                  const on = selected.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggle(c.id, c.kind)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border bg-card p-4 text-left transition-all",
                        on ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
                      )}
                    >
                      {c.image_url && (
                        <img
                          src={c.image_url}
                          alt={c.name}
                          loading="lazy"
                          width={300}
                          height={200}
                          className="mb-3 aspect-3/2 w-full rounded-xl object-cover"
                        />
                      )}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">{c.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatINR(Number(c.price))}
                        </span>
                      </div>
                      {on && (
                        <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-display text-lg font-semibold">Your hamper</p>
            {chosen.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing picked yet. Start with a basket.
              </p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {chosen.map((c) => (
                  <li key={c.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{c.name}</span>
                    <span>{formatINR(Number(c.price))}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <div>
                <Label htmlFor="b-recipient">Recipient name</Label>
                <Input
                  id="b-recipient"
                  className="mt-2"
                  maxLength={120}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label htmlFor="b-message">Gift message</Label>
                <Textarea
                  id="b-message"
                  className="mt-2"
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Optional handwritten note"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Hamper total</span>
              <span className="font-display text-2xl font-semibold">{formatINR(total)}</span>
            </div>

            <Button
              className="mt-4 w-full"
              size="lg"
              disabled={!hasBasket || chosen.length < 2}
              onClick={() => {
                addItem({
                  key: `custom-${Date.now()}`,
                  productId: null,
                  slug: null,
                  name: "Custom Hamper",
                  image: chosen.find((c) => c.image_url)?.image_url ?? null,
                  price: total,
                  customization: {
                    label: "Custom Hamper",
                    componentIds: chosen.map((c) => c.id),
                    message,
                    recipientName: recipient,
                  },
                });
                setSelected([]);
                setMessage("");
                setRecipient("");
                toast.success("Custom hamper added to cart");
              }}
            >
              Add to cart
            </Button>
            {!hasBasket && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Pick a basket and at least one item.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
