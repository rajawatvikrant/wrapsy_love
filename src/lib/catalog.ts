import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[];
  occasions: string[];
  tags: string[];
  contents: string[];
  stock: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_customizable: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type HamperComponent = {
  id: string;
  name: string;
  kind: string;
  price: number;
  image_url: string | null;
  sort_order: number;
};

const PRODUCT_COLUMNS =
  "id,slug,sku,name,short_description,description,category_id,price,compare_at_price,images,occasions,tags,contents,stock,rating,review_count,is_featured,is_bestseller,is_new,is_customizable";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name,description,image_url,sort_order")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as Category[];
}

export type ProductFilters = {
  category?: string | undefined;
  occasion?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  rating?: number | undefined;
  q?: string | undefined;
  tag?: string | undefined;
  sort?: string | undefined;
  customizable?: boolean | undefined;
  inStock?: boolean | undefined;
};

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let query = supabase.from("products").select(PRODUCT_COLUMNS).eq("is_active", true);

  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .maybeSingle();
    if (cat?.id) query = query.eq("category_id", cat.id);
    else return [];
  }
  if (filters.occasion) query = query.contains("occasions", [filters.occasion]);
  if (filters.tag) query = query.contains("tags", [filters.tag]);
  if (filters.min !== undefined) query = query.gte("price", filters.min);
  if (filters.max !== undefined) query = query.lte("price", filters.max);
  if (filters.rating) query = query.gte("rating", filters.rating);
  if (filters.customizable) query = query.eq("is_customizable", true);
  if (filters.inStock) query = query.gt("stock", 0);
  if (filters.q) {
    const term = filters.q.replace(/[%,()]/g, " ").trim();
    if (term) query = query.or(`name.ilike.%${term}%,short_description.ilike.%${term}%,sku.ilike.%${term}%`);
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("is_bestseller", { ascending: false }).order("rating", { ascending: false });
  }

  const { data, error } = await query.limit(60);
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return (data as Product) ?? null;
}

export async function fetchHamperComponents(): Promise<HamperComponent[]> {
  const { data, error } = await supabase
    .from("hamper_components")
    .select("id,name,kind,price,image_url,sort_order")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as HamperComponent[];
}

export async function fetchReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id,author_name,rating,title,body,images,created_at,helpful_count")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export const OCCASIONS = [
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate" },
  { value: "festival", label: "Festival" },
  { value: "thank-you", label: "Thank You" },
];

export const BUDGETS = [
  { label: "Under ₹999", min: 0, max: 999 },
  { label: "₹1,000 – ₹1,999", min: 1000, max: 1999 },
  { label: "₹2,000 – ₹3,499", min: 2000, max: 3499 },
  { label: "₹3,500 – ₹4,999", min: 3500, max: 4999 },
  { label: "₹5,000 & above", min: 5000, max: 100000 },
];
