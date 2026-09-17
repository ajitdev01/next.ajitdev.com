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

export const categories = [
  "all",
  "men's clothing",
  "women's clothing",
  "electronics",
  "jewelery",
  "smartphones",
  "laptops",
  "fragrances",
  "skin-care",
  "groceries",
] as const;

export type Category = (typeof categories)[number];

export const categoryLabels: Record<string, string> = {
  all: "All Products",
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
  electronics: "Electronics",
  jewelery: "Jewelery",
  smartphones: "Smartphones",
  laptops: "Laptops",
  fragrances: "Fragrances",
  "skin-care": "Skin Care",
  groceries: "Groceries",
};

export const categoryIcons: Record<string, string> = {
  all: "🛍️",
  "men's clothing": "👔",
  "women's clothing": "👗",
  electronics: "🖥️",
  jewelery: "💎",
  smartphones: "📱",
  laptops: "💻",
  fragrances: "🌸",
  "skin-care": "✨",
  groceries: "🥬",
};

export const products: Product[] = [
  {
    id: 1,
    title: "Premium White Pullover Hoodie",
    price: 39.99,
    description:
      "Heavyweight pullover hoodie with a clean front, drawstring hood and everyday casual fit.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 112 },
  },
  {
    id: 2,
    title: "Classic White Street Hoodie",
    price: 42.99,
    description:
      "Minimal white hoodie designed for streetwear, casual outings and comfortable layering.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 131 },
  },
  {
    id: 3,
    title: "Relaxed White Hooded Sweatshirt",
    price: 36.50,
    description:
      "Relaxed-fit hooded sweatshirt with a soft casual silhouette for daily wear.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1616030257764-0fe6a2f05138?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 150 },
  },
  {
    id: 4,
    title: "Minimalist White Hoodie",
    price: 44.00,
    description:
      "Clean minimalist hoodie with a roomy front pocket and modern everyday styling.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1738486260590-23c954cf29b8?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 169 },
  },
  {
    id: 5,
    title: "Soft White Fleece Hoodie",
    price: 41.99,
    description:
      "Soft fleece hoodie built for warmth, comfort and easy everyday layering.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1526476148966-98bd039463ea?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 188 },
  },
  {
    id: 6,
    title: "Urban White Oversized Hoodie",
    price: 46.99,
    description:
      "Oversized hoodie with a contemporary streetwear fit and relaxed sleeves.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1636964898666-77c2e8e2a218?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 207 },
  },
  {
    id: 7,
    title: "Premium Cotton Hoodie",
    price: 49.99,
    description:
      "Premium-feel cotton hoodie with ribbed cuffs, adjustable hood and classic styling.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1632682582909-2b3a2581eef7?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 226 },
  },
  {
    id: 8,
    title: "Everyday Black Hoodie",
    price: 38.99,
    description:
      "Versatile black hoodie for casual wear, travel and cooler evenings.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 245 },
  },
  {
    id: 9,
    title: "Heavyweight Black Hoodie",
    price: 54.99,
    description:
      "Heavyweight hooded sweatshirt designed for a structured, warm streetwear fit.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 264 },
  },
  {
    id: 10,
    title: "Classic Oversized Hoodie",
    price: 45.99,
    description:
      "Oversized casual hoodie with a relaxed silhouette and everyday comfort.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1616030257764-0fe6a2f05138?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 283 },
  },
  {
    id: 11,
    title: "Modern White Smartphone",
    price: 499.00,
    description:
      "Modern smartphone with a bright display, premium glass styling and an everyday camera system.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.1, count: 145 },
  },
  {
    id: 12,
    title: "Compact Black Smartphone",
    price: 599.00,
    description:
      "Compact black smartphone designed for everyday performance, photography and communication.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 168 },
  },
  {
    id: 13,
    title: "Silver Flagship Smartphone",
    price: 799.00,
    description:
      "Premium silver smartphone with a large display, advanced cameras and fast charging.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 191 },
  },
  {
    id: 14,
    title: "Next-Gen Smartphone",
    price: 699.00,
    description:
      "Modern smartphone combining a bright display, capable cameras and smooth daily performance.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 214 },
  },
  {
    id: 15,
    title: "Premium Camera Smartphone",
    price: 899.00,
    description:
      "Camera-focused smartphone designed for detailed photos, video and everyday productivity.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1726587912121-ea21fcc57ff8?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 237 },
  },
  {
    id: 16,
    title: "Slim Edge Smartphone",
    price: 649.00,
    description:
      "Slim smartphone with a modern edge-to-edge design and versatile mobile experience.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1596558450268-9c27524ba856?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 260 },
  },
  {
    id: 17,
    title: "Performance Smartphone",
    price: 749.00,
    description:
      "Performance-oriented smartphone for apps, media, gaming and day-to-day multitasking.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 283 },
  },
  {
    id: 18,
    title: "Pro Max Smartphone",
    price: 999.00,
    description:
      "Large flagship-style smartphone with premium materials, high-end cameras and fast performance.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1726574686436-5ef90358e032?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 306 },
  },
  {
    id: 19,
    title: "Creator Smartphone",
    price: 849.00,
    description:
      "Large-display smartphone aimed at creators, photography, streaming and mobile productivity.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.1, count: 329 },
  },
  {
    id: 20,
    title: "Everyday 5G Smartphone",
    price: 429.00,
    description:
      "Affordable modern smartphone with 5G connectivity, bright display and capable cameras.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 352 },
  },
  {
    id: 21,
    title: "Slim Silver Laptop",
    price: 899.00,
    description:
      "Slim aluminum-style laptop for study, office work, development and everyday productivity.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.0, count: 90 },
  },
  {
    id: 22,
    title: "Business Performance Laptop",
    price: 1099.00,
    description:
      "Productivity-focused laptop with a clean design for office work, coding and multitasking.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1581913229425-9c6b993fc107?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.1, count: 117 },
  },
  {
    id: 23,
    title: "Creative Work Laptop",
    price: 1299.00,
    description:
      "Laptop designed for creative applications, media work and demanding productivity tasks.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1692663732610-dce180040495?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 144 },
  },
  {
    id: 24,
    title: "Modern 15-inch Laptop",
    price: 949.00,
    description:
      "Modern large-screen laptop suitable for study, browsing, development and office workloads.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1692663603499-842415b520f0?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 171 },
  },
  {
    id: 25,
    title: "Premium Notebook Computer",
    price: 1399.00,
    description:
      "Premium notebook computer with a minimalist design and high-resolution display.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1593855973333-ed706c14438f?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 198 },
  },
  {
    id: 26,
    title: "Developer Laptop",
    price: 1249.00,
    description:
      "Developer-friendly laptop for coding, containers, documentation and daily engineering work.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1636081890206-b29817bfb178?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 225 },
  },
  {
    id: 27,
    title: "Portable Productivity Laptop",
    price: 799.00,
    description:
      "Portable laptop designed for students, travel, office work and everyday productivity.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1636081891531-f5379c90433a?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 252 },
  },
  {
    id: 28,
    title: "Creator 16-inch Laptop",
    price: 1499.00,
    description:
      "Large-display creator laptop for development, design, content and multitasking.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 279 },
  },
  {
    id: 29,
    title: "Professional Work Laptop",
    price: 1199.00,
    description:
      "Professional laptop for business, software development and demanding daily workloads.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1581913229425-9c6b993fc107?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 306 },
  },
  {
    id: 30,
    title: "Everyday Slim Notebook",
    price: 749.00,
    description:
      "Lightweight notebook for browsing, study, streaming and common office tasks.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1692663732610-dce180040495?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.9, count: 333 },
  },
  {
    id: 31,
    title: "Home Office Desktop Setup",
    price: 849.00,
    description:
      "Complete-looking desktop workstation with monitor, keyboard, mouse and speakers for home productivity.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 75 },
  },
  {
    id: 32,
    title: "RGB Gaming PC Setup",
    price: 1599.00,
    description:
      "Gaming desktop setup with an RGB keyboard, large display and dedicated tower.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 106 },
  },
  {
    id: 33,
    title: "Dark Gaming Workstation",
    price: 1399.00,
    description:
      "Dark-themed desktop workstation for gaming, development and media workloads.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1489257712451-3a66755ca19c?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 137 },
  },
  {
    id: 34,
    title: "Ultrawide Gaming PC",
    price: 1899.00,
    description:
      "Premium gaming setup with an ultrawide monitor, tower, keyboard and mouse.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 168 },
  },
  {
    id: 35,
    title: "Dual-Purpose Desktop Setup",
    price: 1099.00,
    description:
      "Balanced desktop setup for productivity, entertainment, coding and general use.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 199 },
  },
  {
    id: 36,
    title: "Premium Black Wireless Headphones",
    price: 149.00,
    description:
      "Over-ear wireless headphones with a premium look, padded earcups and everyday listening comfort.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.0, count: 80 },
  },
  {
    id: 37,
    title: "Sony-Style Black ANC Headphones",
    price: 199.00,
    description:
      "Premium-looking noise-cancelling over-ear headphones for travel, work and music.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.1, count: 101 },
  },
  {
    id: 38,
    title: "Modern Rose Gold Headphones",
    price: 229.00,
    description:
      "Statement over-ear headphones with a polished finish and immersive listening design.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 122 },
  },
  {
    id: 39,
    title: "Classic Wired Studio Headphones",
    price: 89.00,
    description:
      "Over-ear wired headphones designed for home listening, editing and studio-style monitoring.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 143 },
  },
  {
    id: 40,
    title: "Black Bluetooth Headphones",
    price: 129.00,
    description:
      "Comfort-focused Bluetooth headphones with a minimalist black finish.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1641048930621-ab5d225ae5b0?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 164 },
  },
  {
    id: 41,
    title: "Travel Noise-Cancelling Headphones",
    price: 179.00,
    description:
      "Travel-friendly over-ear headphones built around comfortable long listening sessions.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 185 },
  },
  {
    id: 42,
    title: "Premium Studio Headset",
    price: 159.00,
    description:
      "Over-ear headset with a clean studio-inspired look for music, media and work.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 206 },
  },
  {
    id: 43,
    title: "Everyday Wireless Headset",
    price: 99.00,
    description:
      "Affordable wireless headset for daily calls, music, study and entertainment.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 227 },
  },
  {
    id: 44,
    title: "Multicolor Lifestyle Sneakers",
    price: 79.99,
    description:
      "Lifestyle sneakers with a colorful layered design for casual outfits and everyday streetwear.",
    category: "footwear",
    image: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.1, count: 130 },
  },
  {
    id: 45,
    title: "White and Red Retro Sneakers",
    price: 89.99,
    description:
      "White sneakers with red accents and a classic retro-inspired silhouette.",
    category: "footwear",
    image: ["https://images.unsplash.com/photo-1605523741177-cd660595c2cf?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 148 },
  },
  {
    id: 46,
    title: "Minimal Street Sneakers",
    price: 74.99,
    description:
      "Clean low-profile sneakers designed for daily casual wear and street style.",
    category: "footwear",
    image: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 166 },
  },
  {
    id: 47,
    title: "Colorblock Fashion Sneakers",
    price: 94.99,
    description:
      "Colorblock sneakers combining bold accents with an everyday casual shape.",
    category: "footwear",
    image: ["https://images.unsplash.com/photo-1605523741177-cd660595c2cf?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 184 },
  },
  {
    id: 48,
    title: "Black Zip-Up Hoodie",
    price: 47.99,
    description:
      "Casual zip-up hoodie with a hood, front closure and versatile everyday styling.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1526476148966-98bd039463ea?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 188 },
  },
  {
    id: 49,
    title: "Gaming Laptop Workstation",
    price: 1349.00,
    description:
      "Laptop workstation setup suitable for software development, gaming and heavy multitasking.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1636081890206-b29817bfb178?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 203 },
  },
  {
    id: 50,
    title: "Premium Black Headset",
    price: 169.00,
    description:
      "Premium over-ear headset with a clean black finish and comfortable padded earcups.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1641048930621-ab5d225ae5b0?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 176 },
  },


  {
    id: 51,
    title: "Oversized Black Streetwear T-Shirt",
    price: 24.99,
    description:
      "Relaxed oversized T-shirt with a clean streetwear silhouette for everyday casual outfits.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 241 },
  },
  {
    id: 52,
    title: "Premium Black Crew Neck T-Shirt",
    price: 29.99,
    description:
      "Classic crew neck cotton T-shirt with a simple everyday fit.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 198 },
  },
  {
    id: 53,
    title: "White Cotton T-Shirt",
    price: 21.99,
    description:
      "Minimal white cotton T-shirt designed for daily wear and easy layering.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 176 },
  },
  {
    id: 54,
    title: "Classic Denim Jacket",
    price: 79.99,
    description:
      "Versatile denim jacket with a timeless casual silhouette for all-season layering.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 219 },
  },
  {
    id: 55,
    title: "Black Bomber Jacket",
    price: 89.99,
    description:
      "Clean bomber jacket with a modern silhouette for casual streetwear and travel.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 187 },
  },
  {
    id: 56,
    title: "Beige Casual Jacket",
    price: 74.99,
    description:
      "Lightweight beige jacket for everyday city wear, travel and layering.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 145 },
  },
  {
    id: 57,
    title: "Classic Blue Jeans",
    price: 59.99,
    description:
      "Straight-fit blue jeans designed for everyday casual outfits.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 263 },
  },
  {
    id: 58,
    title: "Slim Black Jeans",
    price: 64.99,
    description:
      "Slim black jeans with a clean everyday silhouette and versatile styling.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 231 },
  },
  {
    id: 59,
    title: "Relaxed Cargo Pants",
    price: 54.99,
    description:
      "Relaxed cargo pants with multiple pockets and a contemporary casual fit.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 184 },
  },
  {
    id: 60,
    title: "Oversized Gray Sweatshirt",
    price: 44.99,
    description:
      "Soft oversized sweatshirt made for comfortable everyday layering.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 212 },
  },
  {
    id: 61,
    title: "Green Casual Hoodie",
    price: 45.99,
    description:
      "Everyday green hoodie with a relaxed fit and practical front pocket.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 169 },
  },
  {
    id: 62,
    title: "Classic Flannel Shirt",
    price: 49.99,
    description:
      "Soft checked flannel shirt suitable for casual everyday wear and layering.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 157 },
  },
  {
    id: 63,
    title: "Minimal Beige Overshirt",
    price: 58.99,
    description:
      "Modern beige overshirt with a clean utility-inspired silhouette.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 202 },
  },
  {
    id: 64,
    title: "Classic Polo Shirt",
    price: 34.99,
    description:
      "Clean polo shirt for smart-casual outfits, weekends and everyday wear.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1625910513413-5fc45d4f7c78?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 191 },
  },
  {
    id: 65,
    title: "Black Athletic T-Shirt",
    price: 27.99,
    description:
      "Breathable athletic-style T-shirt suitable for workouts and casual wear.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 228 },
  },
  {
    id: 66,
    title: "Matte Black Flagship Phone",
    price: 899.00,
    description:
      "Premium black smartphone with a large display and advanced multi-camera system.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1592286927505-4a46f0f3e2f9?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 298 },
  },
  {
    id: 67,
    title: "Blue Glass Smartphone",
    price: 699.00,
    description:
      "Modern blue smartphone with a glossy glass finish and bright high-resolution display.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 265 },
  },
  {
    id: 68,
    title: "Foldable Smartphone Concept",
    price: 1199.00,
    description:
      "Modern foldable smartphone design aimed at multitasking and mobile productivity.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1627384113972-f4c039927a40?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 183 },
  },
  {
    id: 69,
    title: "Compact White 5G Phone",
    price: 529.00,
    description:
      "Compact 5G smartphone with clean styling and a versatile camera setup.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 205 },
  },
  {
    id: 70,
    title: "Camera Pro Smartphone",
    price: 949.00,
    description:
      "High-end smartphone focused on photography, video and everyday performance.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 319 },
  },
  {
    id: 71,
    title: "Midrange Android Phone",
    price: 379.00,
    description:
      "Balanced Android smartphone for social media, media, calls and everyday apps.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 246 },
  },
  {
    id: 72,
    title: "Gaming Smartphone",
    price: 799.00,
    description:
      "Performance-focused smartphone designed for demanding mobile games and media.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1607936854279-55b8f4c8d3b4?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 281 },
  },
  {
    id: 73,
    title: "Premium Green Smartphone",
    price: 729.00,
    description:
      "Premium green smartphone with a modern camera island and edge-to-edge display.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 254 },
  },
  {
    id: 74,
    title: "Small Screen Everyday Phone",
    price: 339.00,
    description:
      "Compact phone for calls, navigation, social apps and everyday communication.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.1, count: 167 },
  },
  {
    id: 75,
    title: "Titanium Finish Smartphone",
    price: 999.00,
    description:
      "Premium titanium-look smartphone with flagship styling and advanced cameras.",
    category: "smartphones",
    image: ["https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 341 },
  },
  {
    id: 76,
    title: "Dark Gray Developer Laptop",
    price: 1249.00,
    description:
      "Developer-focused laptop for coding, containers, web work and multitasking.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 274 },
  },
  {
    id: 77,
    title: "Thin Business Notebook",
    price: 899.00,
    description:
      "Portable business laptop with a clean professional design for office workloads.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 205 },
  },
  {
    id: 78,
    title: "Gaming Laptop RGB",
    price: 1599.00,
    description:
      "Performance laptop built for gaming, development and graphics-heavy workloads.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 318 },
  },
  {
    id: 79,
    title: "Mac-Style Creator Notebook",
    price: 1399.00,
    description:
      "Premium-looking notebook designed for coding, editing and creative productivity.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 352 },
  },
  {
    id: 80,
    title: "Portable Student Laptop",
    price: 649.00,
    description:
      "Affordable compact laptop for classes, browsing, documents and study.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 187 },
  },
  {
    id: 81,
    title: "Large Display Work Laptop",
    price: 1099.00,
    description:
      "Large-screen laptop for spreadsheets, development, research and office productivity.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 221 },
  },
  {
    id: 82,
    title: "Minimal White Laptop",
    price: 999.00,
    description:
      "Minimal white laptop design for productivity, study and creative workflows.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 209 },
  },
  {
    id: 83,
    title: "Professional Silver Notebook",
    price: 1199.00,
    description:
      "Professional silver notebook for business, engineering and software development.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 268 },
  },
  {
    id: 84,
    title: "Compact Developer Notebook",
    price: 779.00,
    description:
      "Compact laptop for developers, students and mobile work.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 173 },
  },
  {
    id: 85,
    title: "Premium 16-inch Creator Laptop",
    price: 1699.00,
    description:
      "Large premium notebook designed for creative work, software development and multitasking.",
    category: "laptops",
    image: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.9, count: 391 },
  },
  {
    id: 86,
    title: "Black RGB Gaming Tower",
    price: 1699.00,
    description:
      "RGB gaming tower with a glass side panel and high-performance desktop styling.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 289 },
  },
  {
    id: 87,
    title: "White Gaming PC",
    price: 1499.00,
    description:
      "Clean white gaming desktop with a modern tower design and RGB lighting.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 247 },
  },
  {
    id: 88,
    title: "Creator Workstation PC",
    price: 2199.00,
    description:
      "High-performance desktop workstation for editing, 3D work, development and rendering.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 214 },
  },
  {
    id: 89,
    title: "Minimal Office Desktop",
    price: 799.00,
    description:
      "Simple desktop workstation setup for business, browsing and home-office work.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 155 },
  },
  {
    id: 90,
    title: "Dual Monitor Productivity PC",
    price: 1249.00,
    description:
      "Productivity desktop setup with dual displays for coding, research and multitasking.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 183 },
  },
  {
    id: 91,
    title: "Compact Mini Desktop",
    price: 699.00,
    description:
      "Compact desktop computer setup suited to small workspaces and home offices.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 142 },
  },
  {
    id: 92,
    title: "Ultra RGB Battle Station",
    price: 2499.00,
    description:
      "Premium gaming battle station with dramatic RGB lighting and a large display.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.9, count: 327 },
  },
  {
    id: 93,
    title: "Modern Black Workstation",
    price: 1149.00,
    description:
      "Clean desktop workstation for development, content creation and daily productivity.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 176 },
  },
  {
    id: 94,
    title: "Developer Home Lab PC",
    price: 999.00,
    description:
      "Desktop setup suited for coding, containers, virtualization and home lab projects.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 191 },
  },
  {
    id: 95,
    title: "Premium Glass Gaming Tower",
    price: 1999.00,
    description:
      "Showcase gaming tower with a glass panel, RGB lighting and premium components styling.",
    category: "desktops",
    image: ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 245 },
  },
  {
    id: 96,
    title: "27-inch IPS Monitor",
    price: 249.00,
    description:
      "27-inch IPS display for office work, coding, media and everyday productivity.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 264 },
  },
  {
    id: 97,
    title: "Curved Gaming Monitor",
    price: 399.00,
    description:
      "Immersive curved monitor designed for gaming and entertainment.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 231 },
  },
  {
    id: 98,
    title: "Ultrawide Productivity Monitor",
    price: 579.00,
    description:
      "Ultrawide monitor designed for multitasking, development and productivity.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 208 },
  },
  {
    id: 99,
    title: "4K Creator Monitor",
    price: 649.00,
    description:
      "4K monitor intended for detailed creative work, design and content production.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 197 },
  },
  {
    id: 100,
    title: "Vertical Developer Monitor",
    price: 299.00,
    description:
      "Slim monitor setup ideal for coding, documentation and vertical content.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1615750171088-7b33f7ce4d01?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 144 },
  },
  {
    id: 101,
    title: "White Minimal Monitor",
    price: 279.00,
    description:
      "Minimal monitor with a clean aesthetic for study, office and creative spaces.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 133 },
  },
  {
    id: 102,
    title: "Triple Monitor Setup",
    price: 899.00,
    description:
      "Three-monitor workstation configuration designed for demanding multitasking.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1615750171088-7b33f7ce4d01?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 168 },
  },
  {
    id: 103,
    title: "Gaming Display with RGB",
    price: 449.00,
    description:
      "High-refresh-style gaming display with a modern desk setup aesthetic.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 187 },
  },
  {
    id: 104,
    title: "Home Office Monitor",
    price: 199.00,
    description:
      "Affordable display for remote work, study, browsing and productivity.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 156 },
  },
  {
    id: 105,
    title: "Large 32-inch Display",
    price: 499.00,
    description:
      "Large-format display for media, coding, editing and productivity.",
    category: "monitors",
    image: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 173 },
  },
  {
    id: 106,
    title: "Mechanical Gaming Keyboard",
    price: 99.00,
    description:
      "Mechanical-style gaming keyboard with a compact layout and dedicated controls.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 389 },
  },
  {
    id: 107,
    title: "Compact White Mechanical Keyboard",
    price: 109.00,
    description:
      "Compact white mechanical keyboard with a clean desktop aesthetic.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 275 },
  },
  {
    id: 108,
    title: "Wireless Office Keyboard",
    price: 49.00,
    description:
      "Minimal wireless keyboard designed for office desks, study and everyday productivity.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 221 },
  },
  {
    id: 109,
    title: "Gaming RGB Mouse",
    price: 59.00,
    description:
      "Ergonomic gaming mouse with RGB-style lighting and precision-focused design.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 347 },
  },
  {
    id: 110,
    title: "Minimal Wireless Mouse",
    price: 39.00,
    description:
      "Simple wireless mouse with a clean low-profile shape for everyday work.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 198 },
  },
  {
    id: 111,
    title: "USB-C Multiport Hub",
    price: 59.99,
    description:
      "Compact USB-C hub for expanding laptop connectivity with additional ports.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 173 },
  },
  {
    id: 112,
    title: "Portable SSD",
    price: 119.00,
    description:
      "Compact external solid-state drive designed for fast portable file storage.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 251 },
  },
  {
    id: 113,
    title: "Wireless Charging Pad",
    price: 34.99,
    description:
      "Minimal wireless charging pad for compatible smartphones and accessories.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1591290619762-6e1f8d14c7ef?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 145 },
  },
  {
    id: 114,
    title: "Laptop Sleeve",
    price: 29.99,
    description:
      "Protective laptop sleeve with a minimalist design for commuting and travel.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 187 },
  },
  {
    id: 115,
    title: "USB-C Power Adapter",
    price: 49.99,
    description:
      "Compact USB-C power adapter for modern laptops, tablets and phones.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1609592424855-6f293a0e4b51?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 216 },
  },
  {
    id: 116,
    title: "Desk Cable Organizer",
    price: 19.99,
    description:
      "Simple cable management accessory for keeping a clean workstation.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 102 },
  },
  {
    id: 117,
    title: "RGB Desk Light",
    price: 44.99,
    description:
      "Compact desk light for study, coding, gaming and ambient workstation lighting.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 128 },
  },
  {
    id: 118,
    title: "Adjustable Laptop Stand",
    price: 39.99,
    description:
      "Adjustable stand designed to raise a laptop for a more comfortable desktop setup.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1616627988763-d8e3dce3a8be?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 157 },
  },
  {
    id: 119,
    title: "Desk Mat",
    price: 24.99,
    description:
      "Large desk mat for keyboards, mice and clean workstation setups.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 141 },
  },
  {
    id: 120,
    title: "Webcam for Streaming",
    price: 79.99,
    description:
      "USB webcam designed for video calls, streaming and online classes.",
    category: "accessories",
    image: ["https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 189 },
  },
  {
    id: 121,
    title: "Premium Black Tablet",
    price: 599.00,
    description:
      "Large-screen tablet suitable for media, reading, drawing and everyday productivity.",
    category: "tablets",
    image: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 294 },
  },
  {
    id: 122,
    title: "Silver Productivity Tablet",
    price: 449.00,
    description:
      "Lightweight tablet for note-taking, browsing, entertainment and work.",
    category: "tablets",
    image: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 245 },
  },
  {
    id: 123,
    title: "Stylus Tablet",
    price: 699.00,
    description:
      "Large-screen tablet with stylus-friendly design for drawing, writing and productivity.",
    category: "tablets",
    image: ["https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 212 },
  },
  {
    id: 124,
    title: "Compact Travel Tablet",
    price: 329.00,
    description:
      "Compact tablet designed for travel, reading, streaming and everyday browsing.",
    category: "tablets",
    image: ["https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 173 },
  },
  {
    id: 125,
    title: "AMOLED Smartwatch",
    price: 249.00,
    description:
      "Modern smartwatch with a bright display and fitness-oriented everyday design.",
    category: "smartwatches",
    image: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 312 },
  },
  {
    id: 126,
    title: "Sport Smartwatch",
    price: 299.00,
    description:
      "Sport-focused smartwatch design for activity tracking and daily notifications.",
    category: "smartwatches",
    image: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 278 },
  },
  {
    id: 127,
    title: "Classic Black Watch",
    price: 179.00,
    description:
      "Minimal black wristwatch with a timeless everyday design.",
    category: "watches",
    image: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 189 },
  },
  {
    id: 128,
    title: "Silver Chronograph Watch",
    price: 299.00,
    description:
      "Classic silver chronograph-style watch for smart-casual and formal outfits.",
    category: "watches",
    image: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 231 },
  },
  {
    id: 129,
    title: "Premium Leather Watch",
    price: 249.00,
    description:
      "Elegant watch with a leather-strap-inspired classic look.",
    category: "watches",
    image: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 164 },
  },
  {
    id: 130,
    title: "Mirrorless Camera",
    price: 1099.00,
    description:
      "Interchangeable-lens camera suited to travel photography, portraits and video.",
    category: "cameras",
    image: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 347 },
  },
  {
    id: 131,
    title: "Professional DSLR Camera",
    price: 1299.00,
    description:
      "Professional-style DSLR body for photography, events and creative work.",
    category: "cameras",
    image: ["https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 287 },
  },
  {
    id: 132,
    title: "Compact Travel Camera",
    price: 499.00,
    description:
      "Compact digital camera designed for travel, casual photography and everyday memories.",
    category: "cameras",
    image: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 198 },
  },
  {
    id: 133,
    title: "35mm Film Camera",
    price: 329.00,
    description:
      "Classic film camera for analog photography enthusiasts and creative projects.",
    category: "cameras",
    image: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 154 },
  },
  {
    id: 134,
    title: "Studio Camera Setup",
    price: 1599.00,
    description:
      "Professional-looking camera setup for studio photography, video and content production.",
    category: "cameras",
    image: ["https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 176 },
  },
  {
    id: 135,
    title: "Instant Photo Camera",
    price: 119.00,
    description:
      "Fun instant camera concept for casual photography and physical prints.",
    category: "cameras",
    image: ["https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 143 },
  },
  {
    id: 136,
    title: "Urban Laptop Backpack",
    price: 69.99,
    description:
      "Everyday backpack with a laptop compartment and room for accessories.",
    category: "bags",
    image: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 276 },
  },
  {
    id: 137,
    title: "Minimal Travel Backpack",
    price: 74.99,
    description:
      "Minimal travel backpack designed for commuting, study and short trips.",
    category: "bags",
    image: ["https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 219 },
  },
  {
    id: 138,
    title: "Leather Messenger Bag",
    price: 89.99,
    description:
      "Classic messenger-style bag suitable for laptops, documents and daily commuting.",
    category: "bags",
    image: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 187 },
  },
  {
    id: 139,
    title: "Canvas Weekend Bag",
    price: 79.99,
    description:
      "Durable weekend bag for short travel and everyday carry.",
    category: "bags",
    image: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 163 },
  },
  {
    id: 140,
    title: "Classic White Sneakers",
    price: 84.99,
    description:
      "Clean white sneakers for everyday casual outfits and streetwear.",
    category: "footwear",
    image: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 321 },
  },
  {
    id: 141,
    title: "Black Running Sneakers",
    price: 89.99,
    description:
      "Sporty black sneakers designed for casual running, walking and everyday use.",
    category: "footwear",
    image: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 284 },
  },
  {
    id: 142,
    title: "Retro Running Shoes",
    price: 99.99,
    description:
      "Retro-inspired running shoes with a colorful everyday lifestyle design.",
    category: "footwear",
    image: ["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 237 },
  },
  {
    id: 143,
    title: "Premium Leather Sneakers",
    price: 119.99,
    description:
      "Premium casual sneakers with a clean leather-inspired silhouette.",
    category: "footwear",
    image: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.7, count: 195 },
  },
  {
    id: 144,
    title: "4K Smart TV",
    price: 899.00,
    description:
      "Large-screen smart TV for streaming, sports, movies and connected entertainment.",
    category: "televisions",
    image: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.6, count: 208 },
  },
  {
    id: 145,
    title: "Large OLED Television",
    price: 1399.00,
    description:
      "Premium large-screen OLED-style television for immersive home entertainment.",
    category: "televisions",
    image: ["https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.8, count: 174 },
  },
  {
    id: 146,
    title: "Smart Home Speaker",
    price: 129.00,
    description:
      "Compact smart speaker for music, timers, information and connected-home control.",
    category: "smart-home",
    image: ["https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 188 },
  },
  {
    id: 147,
    title: "Minimal Bluetooth Speaker",
    price: 89.00,
    description:
      "Portable Bluetooth speaker with a simple modern design for everyday listening.",
    category: "audio",
    image: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.5, count: 254 },
  },
  {
    id: 148,
    title: "Desk Coffee Maker",
    price: 119.00,
    description:
      "Compact countertop coffee maker designed for home and office kitchens.",
    category: "home-appliances",
    image: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.3, count: 149 },
  },
  {
    id: 149,
    title: "Minimal Air Purifier",
    price: 159.00,
    description:
      "Compact air purifier with a clean modern design for home and workspace use.",
    category: "home-appliances",
    image: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.2, count: 117 },
  },
  {
    id: 150,
    title: "Navy Blue Hoodie",
    price: 43.99,
    description:
      "Soft navy hoodie with a relaxed everyday fit and adjustable drawstring hood.",
    category: "clothing",
    image: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"],
    rating: { rate: 4.4, count: 158 },
  },
];
