import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-store";
import type { Product } from "@/lib/catalog";
import { discountPercent, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Elegant diagonal corner ribbon & hand-tied bow SVG:
 * Communicates a luxury digital gift card / gift voucher without needing a physical box lid.
 */
function CornerRibbonBow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-1 -top-1 z-20 size-16 sm:size-18 overflow-hidden"
    >
      {/* Diagonal satin ribbon fold */}
      <div className="absolute -left-[24px] top-[14px] flex h-[14px] w-[88px] -rotate-45 items-center justify-center bg-linear-to-r from-primary/95 via-primary to-primary/90 shadow-xs">
        {/* Subtle gold center stitch */}
        <div className="h-[1px] w-full bg-gold/50" />
      </div>

      {/* Hand-tied miniature satin bow */}
      <svg
        viewBox="0 0 32 20"
        className="absolute left-2.5 top-2.5 size-6 sm:size-7 text-primary drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Bow Loop */}
        <path
          d="M16 10 C12 3, 3 3, 5 11 C6.5 15, 12 13, 16 10 Z"
          className="opacity-95"
        />
        {/* Right Bow Loop */}
        <path
          d="M16 10 C20 3, 29 3, 27 11 C25.5 15, 20 13, 16 10 Z"
          className="opacity-95"
        />
        {/* Left Ribbon Tail */}
        <path
          d="M14 10 C12 13, 9 17, 6 18 C8 17, 12 14, 14 10 Z"
          className="opacity-85"
        />
        {/* Right Ribbon Tail */}
        <path
          d="M18 10 C20 13, 23 17, 26 18 C24 17, 20 14, 18 10 Z"
          className="opacity-85"
        />
        {/* Center Ribbon Knot with gold accent */}
        <ellipse cx="16" cy="9.5" rx="2.5" ry="2" className="fill-current text-gold" />
      </svg>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, wishlist, toggleWishlist } = useCart();
  const off = discountPercent(product.price, product.compare_at_price);
  const saved = wishlist.includes(product.slug);

  return (
    <article className="group relative flex h-full flex-col opacity-100 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card ring-1 ring-inset ring-gold/15 shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
      {/* CORNER RIBBON & BOW DECORATION */}
      <CornerRibbonBow />

      {/* PRODUCT IMAGE CONTAINER */}
      <div className="relative aspect-4/3 overflow-hidden bg-secondary">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block size-full"
          tabIndex={-1}
        >
          <img
            src={product.images[0] ?? "/images/hero-hamper.jpg"}
            alt={product.name}
            loading="lazy"
            width={640}
            height={480}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        </Link>

        {/* Wishlist Button (Top-Right, touch-friendly 40px) */}
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur shadow-xs transition-colors hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Heart className={cn("size-4 transition-colors", saved && "fill-primary text-primary")} />
        </button>

        {/* Badges (Bottom-Left of image, clear of top-left ribbon) */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1">
          {product.is_bestseller && (
            <span className="rounded-full bg-primary/95 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow-xs backdrop-blur">
              Bestseller
            </span>
          )}
          {product.is_new && (
            <span className="rounded-full bg-gold/95 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-foreground shadow-xs backdrop-blur">
              New
            </span>
          )}
        </div>
      </div>

      {/* GIFT CARD DETAILS */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="size-3.5 fill-gold text-gold" />
            <span className="font-medium text-foreground">{Number(product.rating).toFixed(1)}</span>
            <span>({product.review_count})</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">
            Gift Hamper
          </span>
        </div>

        <h3 className="font-display text-base sm:text-lg leading-snug font-semibold">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
          >
            {product.name}
          </Link>
        </h3>

        <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">
          {product.short_description}
        </p>

        {/* PRICING & ACTION ROW (Anchored to bottom) */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-bold text-foreground">
                {formatINR(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatINR(product.compare_at_price)}
                </span>
              )}
            </div>
            {off && <span className="text-xs font-semibold text-success">{off}% off</span>}
          </div>

          <Button
            size="sm"
            className="rounded-full px-4 font-medium"
            disabled={product.stock <= 0}
            onClick={() => {
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0] ?? null,
                price: product.price,
              });
              toast.success(`${product.name} added to cart`);
            }}
          >
            {product.stock > 0 ? "Add" : "Sold out"}
          </Button>
        </div>
      </div>
    </article>
  );
}
