import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type PricedLine = {
  productId: string | null;
  name: string;
  slug: string | null;
  image: string | null;
  unitPrice: number;
  quantity: number;
  customization: Record<string, unknown> | null;
};

export type OrderLineInput = {
  productId: string | null;
  componentIds?: string[] | undefined;
  label?: string | undefined;
  message?: string | undefined;
  recipientName?: string | undefined;
  quantity: number;
};

const TAX_RATE = 0.05;

/** Server-authoritative pricing. Never trust prices sent by the client. */
export async function priceOrder(
  items: OrderLineInput[],
  couponCode: string | null,
  deliveryMethod: "standard" | "express",
) {
  const productIds = items.map((i) => i.productId).filter((id): id is string => Boolean(id));
  const componentIds = [...new Set(items.flatMap((i) => i.componentIds ?? []))];

  const [{ data: products }, { data: components }] = await Promise.all([
    productIds.length
      ? supabaseAdmin
          .from("products")
          .select("id,name,slug,price,images,stock,is_active")
          .in("id", productIds)
      : Promise.resolve({ data: [] as never[] }),
    componentIds.length
      ? supabaseAdmin
          .from("hamper_components")
          .select("id,name,price,is_active")
          .in("id", componentIds)
      : Promise.resolve({ data: [] as never[] }),
  ]);

  const productMap = new Map((products ?? []).map((p) => [p.id, p]));
  const componentMap = new Map((components ?? []).map((c) => [c.id, c]));

  const lines: PricedLine[] = [];
  for (const item of items) {
    if (item.productId) {
      const product = productMap.get(item.productId);
      if (!product || !product.is_active) continue;
      lines.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] ?? null,
        unitPrice: Number(product.price),
        quantity: item.quantity,
        customization: item.message || item.recipientName
          ? { message: item.message ?? null, recipientName: item.recipientName ?? null }
          : null,
      });
      continue;
    }

    const chosen = (item.componentIds ?? [])
      .map((id) => componentMap.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c) && c!.is_active);
    if (chosen.length === 0) continue;
    const unitPrice = chosen.reduce((sum, c) => sum + Number(c.price), 0);
    lines.push({
      productId: null,
      name: item.label || "Custom Hamper",
      slug: null,
      image: null,
      unitPrice,
      quantity: item.quantity,
      customization: {
        components: chosen.map((c) => c.name),
        message: item.message ?? null,
        recipientName: item.recipientName ?? null,
      },
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  let discount = 0;
  let appliedCoupon: string | null = null;
  let couponError: string | null = null;

  if (couponCode) {
    const code = couponCode.trim().toUpperCase();
    const { data: coupon } = await supabaseAdmin
      .from("coupons")
      .select("code,discount_type,discount_value,min_order,max_discount,usage_limit,used_count,starts_at,ends_at,is_active")
      .eq("code", code)
      .maybeSingle();

    if (!coupon || !coupon.is_active) couponError = "This coupon code is not valid.";
    else if (coupon.ends_at && new Date(coupon.ends_at) < new Date()) couponError = "This coupon has expired.";
    else if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit)
      couponError = "This coupon has reached its usage limit.";
    else if (subtotal < Number(coupon.min_order))
      couponError = `Add ₹${Math.ceil(Number(coupon.min_order) - subtotal)} more to use ${code}.`;
    else {
      const raw =
        coupon.discount_type === "percent"
          ? (subtotal * Number(coupon.discount_value)) / 100
          : Number(coupon.discount_value);
      discount = Math.round(
        coupon.max_discount ? Math.min(raw, Number(coupon.max_discount)) : raw,
      );
      appliedCoupon = code;
    }
  }

  const taxable = Math.max(subtotal - discount, 0);
  const shipping = deliveryMethod === "express" ? 199 : taxable >= 1499 ? 0 : 79;
  const tax = Math.round(taxable * TAX_RATE);
  const total = taxable + shipping + tax;

  return { lines, subtotal, discount, shipping, tax, total, appliedCoupon, couponError };
}
