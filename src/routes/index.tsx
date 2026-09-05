import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Gift, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Suspense, lazy, useEffect, useRef } from "react";
import gsap from "gsap";

import { CurvyScrollLine } from "@/components/visual/CurvyScrollLine";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-reveal";
import { OCCASIONS, fetchCategories, fetchProducts } from "@/lib/catalog";

const HeartField = lazy(() => import("@/components/visual/HeartField"));

const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: async () => {
    const [categories, featured, bestsellers] = await Promise.all([
      fetchCategories(),
      fetchProducts({ sort: "rating" }),
      fetchProducts({ tag: "bestseller" }),
    ]);
    return {
      categories,
      featured: featured.filter((p) => p.is_featured).slice(0, 8),
      bestsellers: bestsellers.slice(0, 4),
    };
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wrapsy Love — Where Emotions Are Wrapped with Love" },
      {
        name: "description",
        content:
          "Custom and festive gift hampers for birthdays, Rakhi and every event — handmade in Indore, starting at ₹599, shipping PAN India.",
      },
      { property: "og:title", content: "Wrapsy Love — Gift Hampers from ₹599" },
      {
        property: "og:description",
        content: "Where emotions are wrapped with love. Handmade in Indore, shipped PAN India.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: Home,
});

const MARQUEE = [
  "Custom hampers",
  "Birthday · Rakhi · Anniversary",
  "Handmade in Indore",
  "Starting ₹599",
  "Shipping PAN India",
  "Wrapped with love",
];

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const contentAreaRef = useRef<HTMLDivElement | null>(null);

  useScrollReveal([data.featured.length, data.bestsellers.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-line", { y: 46, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.25")
        .from(".hero-copy", { y: 24, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cta", { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from(".hero-stat", { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.35");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative isolate flex min-h-[90vh] sm:min-h-[86vh] items-center overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20"
      >
        <div className="absolute inset-0 -z-20 blush-panel opacity-70" />
        <Suspense fallback={null}>
          <HeartField />
        </Suspense>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-4 sm:py-8 text-center sm:px-6">
          <span className="hero-badge inline-flex items-center gap-2 rounded-full border border-gold/50 bg-background/70 px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
            <Sparkles className="size-3.5 text-primary" /> Handmade in Indore · from ₹599
          </span>

          <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="hero-line block">Where emotions are</span>
            <span className="hero-line mt-2 block font-script text-gradient-blush text-[3rem] leading-[1.8]  sm:text-7xl lg:text-8xl">
              wrapped with love
            </span>
          </h1>

          <p className="hero-copy mx-auto mt-7 max-w-xl text-base text-muted-foreground sm:text-lg">
            Custom hampers for birthdays, Rakhi, festivals and every little moment worth
            celebrating — built by you, packed by us, shipped PAN India.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="hero-cta rounded-full px-7">
              <Link to="/build-a-hamper">
                Build your hamper <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="hero-cta rounded-full px-7">
              <Link to="/shop">Browse hampers</Link>
            </Button>
          </div>

          <dl className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4 text-sm">
            {[
              ["₹599", "Starting price"],
              ["4.8★", "Average rating"],
              ["PAN India", "We ship to"],
            ].map(([big, small]) => (
              <div key={small} className="hero-stat glass-panel px-3 py-4">
                <dt className="font-display text-2xl font-bold text-primary">{big}</dt>
                <dd className="text-xs text-muted-foreground">{small}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CONTENT AREA WITH CURVY SCROLL LINE */}
      <div ref={contentAreaRef} className="relative isolate">
        <CurvyScrollLine containerRef={contentAreaRef} />

        {/* MARQUEE */}
        <div className="overflow-hidden border-y border-border/60 bg-secondary/40 py-4">
          <div className="marquee-track font-script text-lg text-primary/80">
            {[...MARQUEE, ...MARQUEE].map((text, i) => (
              <span key={i} className="flex items-center gap-3">
                {text} <Sparkles className="size-4 text-gold" />
              </span>
            ))}
          </div>
        </div>

        {/* PROMISES */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Truck, title: "Shipping PAN India", copy: "Carefully packed, everywhere" },
              { icon: PackageCheck, title: "Starting at ₹599", copy: "Gifting for every budget" },
              { icon: Gift, title: "Every event covered", copy: "Birthdays, Rakhi & festivals" },
              { icon: ShieldCheck, title: "Safe packaging", copy: "Damage-free guarantee" },
            ].map((item) => (
              <div key={item.title} className="glass-panel p-6 hover-glow">
                <item.icon className="size-5 text-primary" />
                <p className="mt-4 font-display text-base font-bold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* OCCASIONS */}
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20 sm:px-6">
          <div data-reveal="up">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Pick the moment</h2>
            <p className="mt-2 text-muted-foreground">Every occasion has a hamper waiting.</p>
          </div>
          <div data-reveal-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {data.categories.slice(0, 10).map((cat) => (
              <Link
                key={cat.id}
                to="/shop"
                search={{ category: cat.slug }}
                className="group relative overflow-hidden rounded-3xl border border-border hover-glow"
              >
                <img
                  src={cat.image_url ?? "/images/hero-hamper.jpg"}
                  alt={cat.name}
                  loading="lazy"
                  width={400}
                  height={300}
                  className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/75 to-transparent" />
                <span className="absolute bottom-3 left-4 font-display text-sm font-bold text-background">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED */}
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20 sm:px-6">
          <div data-reveal="up" className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Loved by everyone</h2>
              <p className="mt-2 text-muted-foreground">Our most-gifted hampers this season.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/shop">View all</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* BUILDER CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20 sm:px-6">
          <div
            data-reveal="scale"
            className="grid items-center gap-8 overflow-hidden rounded-[2.5rem] blush-panel p-8 sm:p-12 lg:grid-cols-2"
          >
            <div>
              <span className="eyebrow">Hamper studio</span>
              <h2 className="mt-3 font-script text-4xl text-primary sm:text-5xl">Build your own</h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Pick a basket, fill it your way, add a handwritten note and a name tag. Live pricing
                as you build — starting at ₹599.
              </p>
              <Button asChild size="lg" className="mt-7 rounded-full px-7">
                <Link to="/build-a-hamper">
                  Start building <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                "/images/hamper-chocolate.jpg",
                "/images/hamper-selfcare.jpg",
                "/images/hamper-festival.jpg",
              ].map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="Hamper components"
                  loading="lazy"
                  width={300}
                  height={300}
                  className={`aspect-square w-full rounded-3xl object-cover shadow-[var(--shadow-soft)] ${i === 1 ? "animate-float" : ""
                    }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* BESTSELLERS */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <h2 data-reveal="up" className="font-display text-3xl font-bold sm:text-4xl">
            Bestsellers
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div data-reveal-stagger className="mt-12 flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <Link
                key={o.value}
                to="/shop"
                search={{ occasion: o.value }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {o.label} gifts
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
