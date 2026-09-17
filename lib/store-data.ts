const API_BASE = "https://api.ajitdev.com/api";

export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string[];
  rating: ProductRating;
}

// ── Internal API shape ────────────────────────────────────────────────────────

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  images: string[];
  rating_rate: string;
  rating_count: number;
}

interface ApiResponse {
  success: boolean;
  total: number;
  count: number;
  data: ApiProduct[];
}

function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.images?.length ? p.images : [p.image_url],
    rating: {
      rate: parseFloat(p.rating_rate),
      count: p.rating_count,
    },
  };
}

// ── Public fetch helpers ──────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/product/`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const json: ApiResponse = await res.json();
  return json.data.map(mapProduct);
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${API_BASE}/product/${id}/`, { cache: "no-store" });
  if (!res.ok) return null;
  const json: { success: boolean; data: ApiProduct } = await res.json();
  return mapProduct(json.data);
}

// ── Static lookup tables ──────────────────────────────────────────────────────

export const categories = [
  "all",
  "clothing",
  "smartphones",
  "laptops",
  "desktops",
  "monitors",
  "tablets",
  "audio",
  "accessories",
  "smartwatches",
  "watches",
  "cameras",
  "footwear",
  "bags",
  "televisions",
  "smart-home",
  "home-appliances",
  "electronics",
  "men's clothing",
  "women's clothing",
  "jewelery",
  "fragrances",
  "skin-care",
  "groceries",
] as const;

export type Category = (typeof categories)[number] | string;

export const categoryLabels: Record<string, string> = {
  all: "All Products",
  clothing: "Clothing",
  smartphones: "Smartphones",
  laptops: "Laptops",
  desktops: "Desktops",
  monitors: "Monitors",
  tablets: "Tablets",
  audio: "Audio & Sound",
  accessories: "Accessories",
  smartwatches: "Smartwatches",
  watches: "Watches",
  cameras: "Cameras",
  footwear: "Footwear",
  bags: "Bags & Backpacks",
  televisions: "Televisions",
  "smart-home": "Smart Home",
  "home-appliances": "Home Appliances",
  electronics: "Electronics",
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
  jewelery: "Jewelery",
  fragrances: "Fragrances",
  "skin-care": "Skin Care",
  groceries: "Groceries",
};

export const categoryIcons: Record<string, string> = {
  all: "🛍️",
  clothing: "👕",
  smartphones: "📱",
  laptops: "💻",
  desktops: "🖥️",
  monitors: "🖥️",
  tablets: "📟",
  audio: "🎧",
  accessories: "⌨️",
  smartwatches: "⌚",
  watches: "⌚",
  cameras: "📷",
  footwear: "👟",
  bags: "🎒",
  televisions: "📺",
  "smart-home": "🏠",
  "home-appliances": "☕",
  electronics: "⚡",
  "men's clothing": "👔",
  "women's clothing": "👗",
  jewelery: "💎",
  fragrances: "🌸",
  "skin-care": "✨",
  groceries: "🥬",
};

