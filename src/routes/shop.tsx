import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";

import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUDGETS, OCCASIONS, fetchCategories, fetchProducts } from "@/lib/catalog";

export type ShopSearch = {
  category?: string | undefined;
  occasion?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  rating?: number | undefined;
  q?: string | undefined;
  sort?: string | undefined;
  customizable?: boolean | undefined;
  inStock?: boolean | undefined;
};

const num = (v: unknown) => (v === undefined || v === "" ? undefined : Number(v) || undefined);
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
const bool = (v: unknown) => (v === true || v === "true" ? true : undefined);

const shopQuery = (search: ShopSearch) =>
  queryOptions({
    queryKey: ["shop", search],
    queryFn: async () => {
      const [categories, products] = await Promise.all([
        fetchCategories(),
        fetchProducts(search),
      ]);
      return { categories, products };
    },
  });

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: str(search['category']),
    occasion: str(search['occasion']),
    min: num(search['min']),
    max: num(search['max']),
    rating: num(search['rating']),
    q: str(search['q']),
    sort: str(search['sort']),
    customizable: bool(search['customizable']),
    inStock: bool(search['inStock']),
  }),
  head: () => ({
    meta: [
      { title: "Shop Gift Hampers — Wrapsy" },
      {
        name: "description",
        content:
          "Browse curated gift hampers by occasion, budget and category. Chocolate, self-care, festive and corporate hampers with fast delivery.",
      },
      { property: "og:title", content: "Shop Gift Hampers — Wrapsy" },
      {
        property: "og:description",
        content: "Filter hampers by occasion, budget and rating. Free delivery over ₹1,499.",
      },
    ],
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(shopQuery(deps)),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { data } = useSuspenseQuery(shopQuery(search));

  const update = (patch: ShopSearch) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const activeBudget = BUDGETS.find((b) => b.min === search.min && b.max === search.max);
  const hasFilters = Boolean(
    search.category || search.occasion || search.min || search.rating || search.q || search.customizable || search.inStock,
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-24 sm:pt-28 pb-14 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold">Gift hampers</h1>
        <p className="mt-2 text-muted-foreground">
          {data.products.length} hampers ready to ship, hand-packed to order.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4" /> Filters
            </p>
            {hasFilters && (
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
                onClick={() =>
                  navigate({ search: {}, replace: true })
                }
              >
                <X className="size-3" /> Clear
              </button>
            )}
          </div>

          <div>
            <Label htmlFor="shop-q">Search</Label>
            <Input
              id="shop-q"
              defaultValue={search.q ?? ""}
              placeholder="Chocolate, spa, festive…"
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") update({ q: e.currentTarget.value || undefined });
              }}
            />
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">Category</legend>
            <ul className="mt-2 space-y-1 text-sm">
              {data.categories.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() =>
                      update({ category: search.category === c.slug ? undefined : c.slug })
                    }
                    className={
                      "w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary " +
                      (search.category === c.slug ? "bg-secondary font-medium text-primary" : "")
                    }
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">Occasion</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() =>
                    update({ occasion: search.occasion === o.value ? undefined : o.value })
                  }
                  className={
                    "rounded-full border px-3 py-1 text-xs transition-colors " +
                    (search.occasion === o.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary")
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">Budget</legend>
            <ul className="mt-2 space-y-1 text-sm">
              {BUDGETS.map((b) => (
                <li key={b.label}>
                  <button
                    type="button"
                    onClick={() =>
                      activeBudget === b
                        ? update({ min: undefined, max: undefined })
                        : update({ min: b.min, max: b.max })
                    }
                    className={
                      "w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary " +
                      (activeBudget === b ? "bg-secondary font-medium text-primary" : "")
                    }
                  >
                    {b.label}
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">More</legend>
            <div className="flex items-center gap-2">
              <Checkbox
                id="f-rating"
                checked={search.rating === 4}
                onCheckedChange={(v) => update({ rating: v ? 4 : undefined })}
              />
              <Label htmlFor="f-rating" className="font-normal">4★ &amp; above</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="f-custom"
                checked={Boolean(search.customizable)}
                onCheckedChange={(v) => update({ customizable: v ? true : undefined })}
              />
              <Label htmlFor="f-custom" className="font-normal">Customizable</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="f-stock"
                checked={Boolean(search.inStock)}
                onCheckedChange={(v) => update({ inStock: v ? true : undefined })}
              />
              <Label htmlFor="f-stock" className="font-normal">In stock only</Label>
            </div>
          </fieldset>
        </aside>

        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Showing {data.products.length} results</p>
            <Select
              value={search.sort ?? "popular"}
              onValueChange={(v) => update({ sort: v === "popular" ? undefined : v })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="font-display text-xl font-semibold">No hampers match those filters</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your budget or clearing the occasion.
              </p>
              <Button className="mt-5" onClick={() => navigate({ search: {}, replace: true })}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
