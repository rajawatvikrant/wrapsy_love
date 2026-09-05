import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { estimateShipping, useCart } from "@/features/cart/cart-store";
import { formatINR } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, setQuantity, subtotal, count } = useCart();
  const shipping = estimateShipping(subtotal);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-display text-xl">Your cart ({count})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is empty for now.</p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link to="/shop">Browse hampers</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3">
                  <img
                    src={item.image ?? "/images/hero-hamper.jpg"}
                    alt={item.name}
                    loading="lazy"
                    width={80}
                    height={80}
                    className="size-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    {item.customization?.componentIds?.length ? (
                      <p className="text-xs text-muted-foreground">
                        {item.customization.componentIds.length} items · custom hamper
                      </p>
                    ) : null}
                    <p className="text-sm text-muted-foreground">{formatINR(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto size-7 text-muted-foreground"
                        aria-label="Remove item"
                        onClick={() => removeItem(item.key)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated delivery</span>
                <span className="font-medium">{shipping === 0 ? "Free" : formatINR(shipping)}</span>
              </div>
              <Button asChild className="w-full" onClick={() => setOpen(false)}>
                <Link to="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
                <Link to="/cart">View cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
