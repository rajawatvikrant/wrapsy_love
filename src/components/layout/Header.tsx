import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/features/cart/cart-store";
import logo from "@/assets/wrapsy-logo.png.asset.json";

const NAV = [
  { label: "Shop", to: "/shop", search: {} },
  { label: "Build", to: "/build-a-hamper", search: {} },
  { label: "Track", to: "/track-order", search: {} },
] as const;

export function Header() {
  const { count, setOpen, wishlist } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    navigate({ to: "/shop", search: term ? { q: term } : {} });
    setMobileOpen(false);
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div
        className={`pointer-events-auto mx-auto flex w-full max-w-5xl items-center gap-3 pill-nav px-3 py-2 transition-all duration-500 sm:px-5 ${scrolled ? "sm:max-w-3xl" : ""
          }`}
      >
        <Link to="/" className="group flex items-center gap-2">
          {/* <img
            src={logo.url}
            alt="Wrapsy Love gift hampers logo"
            width={36}
            height={36}
            className="size-9 object-contain transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
          /> */}
          <span className="font-script text-xl text-primary">Wrapsy</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-6 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={item.search}
              className="story-link text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-[190px] flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              aria-label="Search hampers"
              className="h-9 rounded-full border-transparent bg-secondary/70 pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist" className="rounded-full">
            <Link to="/wishlist" className="relative">
              <Heart className="size-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-gold-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open cart"
            className="relative rounded-full"
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-full">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <nav className="mt-10 flex flex-col gap-2">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    search={item.search}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full px-4 py-3 font-display text-lg font-semibold hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full px-4 py-3 font-display text-lg font-semibold hover:bg-secondary"
                >
                  Account
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
