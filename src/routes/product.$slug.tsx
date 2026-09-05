import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCart } from "@/features/cart/cart-store";
import { fetchProductBySlug, fetchProducts, fetchReviews } from "@/lib/catalog";
import { discountPercent, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const product = await fetchProductBySlug(slug);
      if (!product) return null;
      const [reviews, related] = await Promise.all([
        fetchReviews(product.id),
        fetchProducts({ sort: "rating" }),
      ]);
      return {
        product,
        reviews,
        related: related.filter((p) => p.id !== product.id).slice(0, 4),
      };
    },
  });

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — Wrapsy Gift Hampers` : "Gift Hamper — Wrapsy";
    const description =
      p?.short_description ?? "A hand-packed luxury gift hamper from Wrapsy.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { addItem, wishlist, toggleWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  if (!data) return null;
  const { product, reviews, related } = data;
  const off = discountPercent(product.price, product.compare_at_price);
  const saved = wishlist.includes(product.slug);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-24 sm:pt-28 pb-14 sm:px-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="px-2">/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl border border-border bg-secondary">
            <img
              src={product.images[active] ?? product.images[0] ?? "/images/hero-hamper.jpg"}
              alt={product.name}
              width={1200}
              height={900}
              className="aspect-4/3 w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "size-20 overflow-hidden rounded-xl border",
                    i === active ? "border-primary" : "border-border",
                  )}
                >
                  <img src={img} alt="" loading="lazy" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-gold text-gold" />
            <span className="font-medium">{Number(product.rating).toFixed(1)}</span>
            <span className="text-muted-foreground">({product.review_count} reviews)</span>
            <span className="text-muted-foreground">· SKU {product.sku}</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">{formatINR(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatINR(product.compare_at_price)}
              </span>
            )}
            {off && <span className="text-sm font-medium text-success">{off}% off</span>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <p className="mt-5 text-muted-foreground">{product.short_description}</p>

          {product.contents.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold">What's inside</p>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {product.contents.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-primary">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.is_customizable && (
            <div className="mt-6 space-y-3">
              <div>
                <Label htmlFor="recipient">Recipient name (optional)</Label>
                <Input
                  id="recipient"
                  className="mt-2"
                  value={recipient}
                  maxLength={120}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Who is this for?"
                />
              </div>
              <div>
                <Label htmlFor="message">Gift message (optional)</Label>
                <Textarea
                  id="message"
                  className="mt-2"
                  value={message}
                  maxLength={500}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="We'll handwrite this on a card."
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="grid size-10 place-items-center"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="grid size-10 place-items-center"
                onClick={() => setQty((q) => Math.min(20, q + 1))}
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              size="lg"
              disabled={product.stock <= 0}
              onClick={() => {
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0] ?? null,
                  price: product.price,
                  quantity: qty,
                  ...(message || recipient
                    ? {
                        customization: {
                          label: product.name,
                          componentIds: [],
                          message,
                          recipientName: recipient,
                        },
                      }
                    : {}),
                });
                toast.success("Added to cart");
              }}
            >
              {product.stock > 0 ? "Add to cart" : "Sold out"}
            </Button>

            <Button variant="outline" size="lg" onClick={() => toggleWishlist(product.slug)}>
              <Heart className={cn("size-4", saved && "fill-primary text-primary")} />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4" /> Shipping PAN India · free delivery over ₹1,499
          </p>

          {product.description && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="font-display text-xl font-semibold">Details</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-muted-foreground">No reviews yet for this hamper.</p>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3.5",
                        i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/40",
                      )}
                    />
                  ))}
                </div>
                {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">— {r.author_name}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">You may also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
