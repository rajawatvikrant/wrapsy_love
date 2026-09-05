import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lineSchema = z.object({
  productId: z.string().uuid().nullable(),
  componentIds: z.array(z.string().uuid()).optional(),
  label: z.string().max(120).optional(),
  message: z.string().max(500).optional(),
  recipientName: z.string().max(120).optional(),
  quantity: z.number().int().min(1).max(50),
});

const checkoutSchema = z.object({
  items: z.array(lineSchema).min(1).max(50),
  couponCode: z.string().max(40).optional().nullable(),
  deliveryMethod: z.enum(["standard", "express"]),
  contact: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().min(8).max(20),
  }),
  address: z.object({
    line1: z.string().min(3).max(200),
    line2: z.string().max(200).optional().nullable(),
    city: z.string().min(2).max(80),
    state: z.string().min(2).max(80),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  deliveryDate: z.string().max(20).optional().nullable(),
  giftMessage: z.string().max(500).optional().nullable(),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  userId: z.string().uuid().optional().nullable(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

const TAX_RATE = 0.05;

export const previewOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        items: z.array(lineSchema).min(1),
        couponCode: z.string().max(40).optional().nullable(),
        deliveryMethod: z.enum(["standard", "express"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { priceOrder } = await import("./pricing.server");
    const result = await priceOrder(data.items, data.couponCode ?? null, data.deliveryMethod);
    return {
      subtotal: result.subtotal,
      discount: result.discount,
      shipping: result.shipping,
      tax: result.tax,
      total: result.total,
      couponError: result.couponError,
    };
  });

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data }) => {
    const { priceOrder } = await import("./pricing.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const priced = await priceOrder(data.items, data.couponCode ?? null, data.deliveryMethod);
    if (priced.lines.length === 0) throw new Error("Your cart is no longer available.");

    const orderNumber = `GH${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: data.userId ?? null,
        email: data.contact.email,
        phone: data.contact.phone,
        customer_name: data.contact.name,
        address_line1: data.address.line1,
        address_line2: data.address.line2 ?? null,
        city: data.address.city,
        state: data.address.state,
        pincode: data.address.pincode,
        delivery_date: data.deliveryDate || null,
        delivery_method: data.deliveryMethod,
        gift_message: data.giftMessage ?? null,
        subtotal: priced.subtotal,
        discount: priced.discount,
        shipping: priced.shipping,
        tax: priced.tax,
        total: priced.total,
        coupon_code: priced.appliedCoupon,
        status: data.paymentMethod === "COD" ? "CONFIRMED" : "CONFIRMED",
        payment_status: data.paymentMethod === "COD" ? "PENDING" : "PAID",
        payment_method: data.paymentMethod,
      })
      .select("id,order_number")
      .single();

    if (error || !order) throw new Error("We couldn't place your order. Please try again.");

    const itemRows = priced.lines.map((line) => ({
      order_id: order.id,
      product_id: line.productId,
      name: line.name,
      slug: line.slug,
      image_url: line.image,
      unit_price: line.unitPrice,
      quantity: line.quantity,
      line_total: line.unitPrice * line.quantity,
      customization: (line.customization ?? null) as never,
    }));
    await supabaseAdmin.from("order_items").insert(itemRows);

    return { orderNumber: order.order_number, total: priced.total };
  });

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ orderNumber: z.string().min(4).max(40), email: z.string().email() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "id,order_number,status,payment_status,payment_method,total,subtotal,discount,shipping,tax,created_at,delivery_date,delivery_method,tracking_number,customer_name,city,state,pincode,address_line1",
      )
      .eq("order_number", data.orderNumber.trim().toUpperCase())
      .ilike("email", data.email.trim())
      .maybeSingle();

    if (!order) return { found: false as const };

    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("name,quantity,unit_price,line_total,image_url,slug,customization")
      .eq("order_id", order.id);

    return { found: true as const, order, items: items ?? [] };
  });
