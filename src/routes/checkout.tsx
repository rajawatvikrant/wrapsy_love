import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/features/cart/cart-store";
import { formatINR } from "@/lib/format";
import { placeOrder, previewOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Wrapsy Gift Hampers" },
      {
        name: "description",
        content:
          "Secure guest checkout for your gift hamper: delivery details, gift message, coupons and cash-on-delivery or online payment.",
      },
      { property: "og:title", content: "Checkout — Wrapsy" },
      { property: "og:description", content: "Fast guest checkout for gift hampers." },
    ],
  }),
  component: CheckoutPage,
});

type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponError: string | null;
} | null;

function CheckoutPage() {
  const { items, clear } = useCart();
  const preview = useServerFn(previewOrder);
  const submit = useServerFn(placeOrder);

  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"COD" | "ONLINE">("COD");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [totals, setTotals] = useState<Totals>(null);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<{ orderNumber: string; total: number } | null>(null);

  const lines = items.map((i) => ({
    productId: i.productId,
    ...(i.customization?.componentIds?.length
      ? { componentIds: i.customization.componentIds }
      : {}),
    ...(i.customization?.label ? { label: i.customization.label } : {}),
    ...(i.customization?.message ? { message: i.customization.message } : {}),
    ...(i.customization?.recipientName ? { recipientName: i.customization.recipientName } : {}),
    quantity: i.quantity,
  }));
  const linesKey = JSON.stringify(lines);

  useEffect(() => {
    if (items.length === 0 || placed) return;
    let cancelled = false;
    preview({
      data: { items: JSON.parse(linesKey), couponCode: appliedCoupon, deliveryMethod: delivery },
    })
      .then((res) => {
        if (!cancelled) setTotals(res);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [linesKey, appliedCoupon, delivery, items.length, placed, preview]);

  if (placed) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20 text-center sm:px-6">
        <CheckCircle2 className="mx-auto size-14 text-success" />
        <h1 className="mt-6 font-display text-3xl font-semibold">Order confirmed</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you! Your order <span className="font-medium text-foreground">{placed.orderNumber}</span>{" "}
          for {formatINR(placed.total)} is being packed.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/track-order">Track order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/shop">Keep shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Shop hampers</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPlacing(true);
    try {
      const res = await submit({
        data: {
          items: lines,
          couponCode: appliedCoupon,
          deliveryMethod: delivery,
          contact: {
            name: String(fd.get("name")),
            email: String(fd.get("email")),
            phone: String(fd.get("phone")),
          },
          address: {
            line1: String(fd.get("line1")),
            line2: String(fd.get("line2") ?? ""),
            city: String(fd.get("city")),
            state: String(fd.get("state")),
            pincode: String(fd.get("pincode")),
          },
          deliveryDate: String(fd.get("deliveryDate") ?? "") || null,
          giftMessage: String(fd.get("giftMessage") ?? "") || null,
          paymentMethod: payment,
          userId: null,
        },
      });
      clear();
      setPlaced(res);
    } catch {
      toast.error("We couldn't place your order. Please check your details and retry.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:pt-28 pb-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Checkout</h1>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required minLength={2} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required minLength={8} className="mt-2" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Delivery address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="line1">Address line 1</Label>
                <Input id="line1" name="line1" required className="mt-2" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="line2">Address line 2 (optional)</Label>
                <Input id="line2" name="line2" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="pincode">PIN code</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  required
                  pattern="\d{6}"
                  inputMode="numeric"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="deliveryDate">Preferred delivery date</Label>
                <Input id="deliveryDate" name="deliveryDate" type="date" className="mt-2" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="giftMessage">Gift message (optional)</Label>
                <Textarea id="giftMessage" name="giftMessage" maxLength={500} className="mt-2" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Delivery speed</h2>
            <RadioGroup
              value={delivery}
              onValueChange={(v) => setDelivery(v as "standard" | "express")}
              className="mt-4 gap-3"
            >
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
                <RadioGroupItem value="standard" id="d-standard" />
                <span className="text-sm">
                  <span className="font-medium">Standard</span> — 3-5 days, free over ₹1,499
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
                <RadioGroupItem value="express" id="d-express" />
                <span className="text-sm">
                  <span className="font-medium">Express</span> — next day, ₹199
                </span>
              </label>
            </RadioGroup>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Payment</h2>
            <RadioGroup
              value={payment}
              onValueChange={(v) => setPayment(v as "COD" | "ONLINE")}
              className="mt-4 gap-3"
            >
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
                <RadioGroupItem value="COD" id="p-cod" />
                <span className="text-sm font-medium">Cash on delivery</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
                <RadioGroupItem value="ONLINE" id="p-online" />
                <span className="text-sm font-medium">Pay online (demo)</span>
              </label>
            </RadioGroup>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <p className="font-display text-lg font-semibold">Order summary</p>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatINR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-2">
            <Input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code"
              aria-label="Coupon code"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setAppliedCoupon(coupon.trim() ? coupon.trim() : null)}
            >
              Apply
            </Button>
          </div>
          {totals?.couponError && (
            <p className="mt-2 text-xs text-destructive">{totals.couponError}</p>
          )}
          {appliedCoupon && !totals?.couponError && (
            <p className="mt-2 text-xs text-success">{appliedCoupon} applied</p>
          )}

          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatINR(totals?.subtotal ?? 0)}</dd>
            </div>
            {(totals?.discount ?? 0) > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd>−{formatINR(totals?.discount ?? 0)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{totals?.shipping ? formatINR(totals.shipping) : "Free"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax (5%)</dt>
              <dd>{formatINR(totals?.tax ?? 0)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatINR(totals?.total ?? 0)}</dd>
            </div>
          </dl>

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={placing}>
            {placing ? "Placing order…" : "Place order"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Prices are re-verified on our servers before your order is confirmed.
          </p>
        </aside>
      </form>
    </div>
  );
}
