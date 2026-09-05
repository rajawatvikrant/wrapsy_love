import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-store";
import { fetchProducts } from "@/lib/catalog";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Wrapsy Gift Hampers" },
      {
        name: "description",
        content: "Hampers you've saved for later. Add them to your cart whenever you're ready.",
      },
      { property: "og:title", content: "Your Wishlist — Wrapsy" },
      { property: "og:description", content: "Saved gift hampers, ready when you are." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useCart();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchProducts({}),
  });

  const saved = products.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-24 sm:pt-28 pb-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Your wishlist</h1>

      {isLoading ? (
        <p className="mt-6 text-muted-foreground">Loading…</p>
      ) : saved.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-xl font-semibold">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on any hamper to keep it here.
          </p>
          <Button asChild className="mt-6">
            <Link to="/shop">Browse hampers</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
