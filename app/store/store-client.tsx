"use client";

import React, { useState, useMemo, useCallback, useDeferredValue } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Separator from "@radix-ui/react-separator";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Search,
  Star,
  ShoppingCart,
  Heart,
  X,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Package,
  Sparkles,
  TrendingUp,
  Check,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  PartyPopper,
  CheckCircle2,
  Receipt,
  Tag,
  Truck,
  RotateCcw,
  LayoutGrid,
  List,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Clock,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Share2,
  Download,
  MessageCircle,
  ImageIcon,
  Copy,
  Link2,
} from "lucide-react";
import { toPng } from "html-to-image";
import type { RazorpayOptions } from "@/types/razorpay";
import {
  categories,
  categoryLabels,
  categoryIcons,
  type Product,
  type Category,
} from "@/lib/store-data";
import type { RootState } from "@/lib/store";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleWishlist,
  removeFromWishlist,
  moveToCartFromWishlist,
  addAllWishlistToCart,
  applyCoupon,
  removeCoupon,
  placeOrder,
  clearOrders,
  type Order,
} from "@/lib/store/cartSlice";
import { fireConfetti } from "@/lib/useConfetti";
import { toast } from "sonner";

type SortKey = "default" | "price-asc" | "price-desc" | "rating" | "name";
type PriceRange = "all" | "under-50" | "50-100" | "100-250" | "250-plus";
type ViewMode = "grid" | "list";

const sortLabels: Record<SortKey, string> = {
  default: "Featured",
  "price-asc": "Price: Low → High",
  "price-desc": "Price: High → Low",
  rating: "Highest Rated",
  name: "A – Z",
};

const priceRanges: { id: PriceRange; label: string }[] = [
  { id: "all", label: "All Prices" },
  { id: "under-50", label: "Under $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-250", label: "$100 - $250" },
  { id: "250-plus", label: "$250+" },
];

const availableCoupons = [
  { code: "DEV10", label: "10% OFF", discount: 10 },
  { code: "SUPER20", label: "20% OFF", discount: 20 },
  { code: "FREESHIP", label: "Free Shipping", discount: 0 },
];

export const USD_TO_INR_RATE = 96.33;

const popularCategories = [
  "all",
  "clothing",
  "smartphones",
  "laptops",
  "audio",
  "accessories",
  "groceries",
] as const;

function normalizeCatKey(cat: string): string {
  return (cat || "").toLowerCase().replace(/[-_]/g, " ").trim();
}


/* ───────── Skeleton Shimmer Card ───────── */
function ProductSkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <div
      className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-100 overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
          animation: `shimmer 1.6s ease-in-out ${index * 80}ms infinite`,
          transform: "translateX(-100%)",
        }}
      />
      {/* Image placeholder */}
      <div className="h-36 sm:h-52 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100" />
      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Category badge */}
        <div className="h-4 sm:h-5 w-16 sm:w-20 bg-slate-100 rounded-full" />
        {/* Title lines */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="h-3.5 sm:h-4 w-full bg-slate-100 rounded-lg" />
          <div className="h-3.5 sm:h-4 w-4/5 bg-slate-100 rounded-lg" />
        </div>
        {/* Stars */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-slate-100 rounded-full" />
          ))}
          <div className="h-2.5 sm:h-3 w-8 sm:w-12 bg-slate-100 rounded ml-1" />
        </div>
        {/* Price + button */}
        <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
          <div className="h-5 sm:h-7 w-12 sm:w-16 bg-slate-100 rounded-lg" />
          <div className="h-7 sm:h-9 w-16 sm:w-24 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function SkeletonListItem({ index = 0 }: { index?: number }) {
  return (
    <div
      className="relative flex gap-4 rounded-3xl bg-white border border-slate-100 p-4 overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
          animation: `shimmer 1.6s ease-in-out ${index * 80}ms infinite`,
          transform: "translateX(-100%)",
        }}
      />
      <div className="h-28 w-28 shrink-0 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 w-20 bg-slate-100 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-2/3 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-3 bg-slate-100 rounded-full" />
          ))}
        </div>
        <div className="h-9 w-28 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );
}

/* ───────── Star Rating ───────── */
function Stars({ rate, count }: { rate: number; count: number }) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <div className="flex items-center gap-px">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(1, Math.max(0, rate - i));
          return (
            <span key={i} className="relative h-3 w-3 sm:h-3.5 sm:w-3.5">
              <Star className="absolute inset-0 h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-200" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 whitespace-nowrap">
        {rate.toFixed(1)} ({count})
      </span>
    </div>
  );
}

/* ───────── Quick-View Modal (Radix Dialog) ───────── */
function QuickViewDialog({
  product,
  open,
  onClose,
  onToast,
  onShare,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onShare: (p: Product) => void;
}) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const [justAdded, setJustAdded] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) return null;
  const isLiked = wishlist.includes(product.id);

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: qty }));
    setJustAdded(true);
    toast.success(`Added ${qty} × "${product.title}" to cart!`, {
      description: `Total: $${(product.price * qty).toFixed(2)}`,
    });
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = () => {
    const nextLiked = !isLiked;
    dispatch(toggleWishlist(product.id));
    if (nextLiked) {
      toast.success("Added to Wishlist ❤️", {
        description: `"${product.title}" saved to your favorites.`,
      });
    } else {
      toast.info("Removed from Wishlist", {
        description: `"${product.title}" removed from your favorites.`,
      });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] w-[86vw] max-w-[340px] sm:w-full sm:max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150 p-0 border border-slate-100 max-h-[82vh] overflow-y-auto">
          <Dialog.Title className="sr-only">{product.title}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {product.description}
          </Dialog.Description>

          <Dialog.Close className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition shadow-xs focus:outline-none cursor-pointer">
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Dialog.Close>

          <div className="flex flex-col sm:flex-row">
            <div className="relative h-36 sm:h-auto sm:w-1/2 bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/20 flex items-center justify-center p-3 sm:p-8 shrink-0">
              <Image
                src={product.image[0]}
                alt={product.title}
                width={220}
                height={220}
                className="object-contain max-h-28 sm:max-h-52 transform-gpu"
                priority
              />
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 flex items-center gap-0.5 p-0.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => onShare(product)}
                  className="h-7 w-7 sm:h-9 sm:w-9 rounded-full text-slate-500 hover:text-amber-600 hover:bg-amber-50/80 flex items-center justify-center transition cursor-pointer active:scale-90"
                  title="Share product snapshot"
                >
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <span className="h-3.5 w-[1px] bg-slate-200/80" />
                <button
                  type="button"
                  onClick={handleWishlist}
                  className={`h-7 w-7 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition cursor-pointer active:scale-90 ${
                    isLiked
                      ? "bg-rose-50 text-rose-500 shadow-2xs"
                      : "text-slate-400 hover:text-rose-500 hover:bg-rose-50/80"
                  }`}
                  title={isLiked ? "Remove wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex-1 p-3.5 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 mb-1.5 sm:mb-2.5">
                  {categoryIcons[product.category]}{" "}
                  {categoryLabels[product.category]}
                </span>
                <h3 className="text-xs sm:text-base font-bold text-slate-900 leading-snug line-clamp-1 sm:line-clamp-2 mb-1 sm:mb-1.5">
                  {product.title}
                </h3>
                <Stars rate={product.rating.rate} count={product.rating.count} />
                <p className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {product.description}
                </p>
              </div>

              <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-3.5 border-t border-slate-100 flex flex-col gap-2.5 sm:gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-2xl font-black text-slate-900">
                    ${(product.price * qty).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-slate-100 p-1 border border-slate-200/60">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition cursor-pointer shadow-2xs"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 sm:w-7 text-center text-xs font-bold text-slate-900">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition cursor-pointer shadow-2xs"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={justAdded}
                  style={!justAdded ? { backgroundColor: "#FFD814", borderColor: "#F7CA00" } : undefined}
                  className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-98 cursor-pointer border-2 ${
                    justAdded
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20"
                      : "bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 border-[#F7CA00]"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 text-slate-950" />
                      <span>Add to Cart • ${(product.price * qty).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ───────── Wishlist Drawer (Radix Dialog) ───────── */
function WishlistDrawer({
  open,
  onClose,
  onOpenCart,
  onToast,
  allProducts,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCart: () => void;
  onToast: (msg: string) => void;
  allProducts: Product[];
}) {
  const dispatch = useDispatch();
  const wishlistIds = useSelector((state: RootState) => state.cart.wishlist);

  const wishlistProducts = useMemo(() => {
    return allProducts.filter((p) => wishlistIds.includes(p.id));
  }, [allProducts, wishlistIds]);

  const handleMoveToCart = (prod: Product) => {
    dispatch(moveToCartFromWishlist(prod));
    toast.success("Moved to Cart! 🛒", {
      description: `"${prod.title}" is now in your cart.`,
    });
  };

  const handleMoveAllToCart = () => {
    dispatch(addAllWishlistToCart(wishlistProducts));
    toast.success("All items moved to Cart! 🛒", {
      description: `${wishlistProducts.length} items added to your cart.`,
    });
    onClose();
    onOpenCart();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
        <Dialog.Content className="fixed top-0 right-0 bottom-0 z-[90] w-full max-w-md bg-white shadow-2xl flex flex-col focus:outline-none transition-transform animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Heart className="h-5 w-5 fill-rose-500" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Your Wishlist
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-400">
                  {wishlistProducts.length}{" "}
                  {wishlistProducts.length === 1 ? "item saved" : "items saved"}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition focus:outline-none">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {wishlistProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="h-16 w-16 rounded-3xl bg-rose-50 flex items-center justify-center mb-4 text-rose-300">
                  <Heart className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Wishlist is empty
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Tap the heart icon on any product to save it here. Everything
                  persists across page reloads!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {wishlistProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3 items-center transform-gpu transition hover:border-slate-200"
                  >
                    <div className="h-14 w-14 shrink-0 rounded-xl bg-white flex items-center justify-center p-2 border border-slate-100">
                      <Image
                        src={prod.image[0]}
                        alt={prod.title}
                        width={46}
                        height={46}
                        className="object-contain max-h-12"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {prod.title}
                      </h4>
                      <p className="text-xs text-slate-400 capitalize">
                        {prod.category}
                      </p>
                      <p className="text-xs font-black text-slate-900 mt-0.5">
                        ${prod.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleMoveToCart(prod)}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition active:scale-95"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => {
                          dispatch(removeFromWishlist(prod.id));
                          toast.info("Removed from Wishlist", {
                            description: `"${prod.title}" removed.`,
                          });
                        }}
                        className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 p-1.5 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          {wishlistProducts.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
              <button
                onClick={handleMoveAllToCart}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-98"
              >
                <ShoppingCart className="h-4 w-4" /> Move All to Cart (
                {wishlistProducts.length})
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ───────── Radix Confirmation Dialog ───────── */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Yes, Clear",
  cancelText = "Cancel",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[260] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl p-6 text-center focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150 border border-slate-100">
          <div className="mx-auto mb-3.5 h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
            <Trash2 className="h-6 w-6" />
          </div>
          <AlertDialog.Title className="text-base font-bold text-slate-900 mb-1">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-xs text-slate-500 leading-relaxed mb-5">
            {description}
          </AlertDialog.Description>
          <div className="flex items-center justify-center gap-2.5">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="flex-1 rounded-2xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition active:scale-98 focus:outline-none"
              >
                {cancelText}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-2xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition active:scale-98 focus:outline-none"
              >
                {confirmText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

/* ───────── Order History Drawer (Radix Dialog) ───────── */
function OrdersDrawer({
  open,
  onClose,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}) {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.cart.orders);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      dispatch(addToCart({ product: item.product, quantity: item.quantity }));
    });
    toast.success(`Reordered Order #${order.id}! 🛍️`, {
      description: `${order.items.length} items added back to your cart.`,
    });
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
          <Dialog.Content className="fixed top-0 right-0 bottom-0 z-[90] w-full max-w-lg bg-white shadow-2xl flex flex-col focus:outline-none transition-transform animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <Dialog.Title className="text-base font-bold text-slate-900">
                    Order History
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-400">
                    {orders.length}{" "}
                    {orders.length === 1 ? "order recorded" : "orders recorded"} •
                    Persisted in Redux
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition focus:outline-none">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="h-16 w-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                    <Receipt className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    No Orders Yet
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Your placed orders will appear here and remain permanently
                    saved across page refreshes.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-slate-300"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-2.5">
                        <div>
                          <span className="text-xs font-black text-slate-900 font-mono">
                            #{ord.id}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{ord.date}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            {ord.status}
                          </span>
                          {ord.paymentId && (
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {ord.paymentId}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 mb-2.5">
                        {ord.items.map((it) => (
                          <div
                            key={it.product.id}
                            className="flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="truncate text-slate-700 font-medium">
                                {it.product.title}
                              </span>
                              <span className="text-slate-400 shrink-0">
                                ×{it.quantity}
                              </span>
                            </div>
                            <span className="font-bold text-slate-900 shrink-0">
                              ${(it.product.price * it.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs font-black text-slate-900 pt-2 border-t border-slate-200">
                        <div>
                          <span>
                            Total: ₹{(ord.totalUSD ? ord.total : (ord.total * USD_TO_INR_RATE)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="ml-1.5 text-[11px] font-normal text-slate-500">
                            (${Number(ord.totalUSD ?? ord.total).toFixed(2)})
                          </span>
                        </div>
                        <button
                          onClick={() => handleReorder(ord)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-100 transition active:scale-95 cursor-pointer"
                        >
                          <RotateCcw className="h-3 w-3 text-slate-600" />
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {orders.length > 0 && (
              <div className="border-t border-slate-100 px-6 py-3.5 bg-slate-50/50 flex justify-between items-center">

                <button
                  onClick={() => setConfirmClearOpen(true)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                >
                  Clear History
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="Clear Order History?"
        description="Are you sure you want to permanently delete all your recorded orders? This action cannot be undone."
        confirmText="Yes, Clear History"
        cancelText="Cancel"
        onConfirm={() => {
          dispatch(clearOrders());
          toast.info("Order history cleared", {
            description: "Your past orders have been reset.",
          });
        }}
      />
    </>
  );
}

/* ───────── Razorpay SDK Loader ───────── */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    let isDone = false;
    const done = (success: boolean) => {
      if (!isDone) {
        isDone = true;
        resolve(success);
      }
    };

    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => done(Boolean(window.Razorpay));
      script.onerror = () => done(false);
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", () => done(Boolean(window.Razorpay)), { once: true });
      script.addEventListener("error", () => done(false), { once: true });
    }

    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (window.Razorpay) {
        clearInterval(timer);
        done(true);
      } else if (attempts >= 50) {
        clearInterval(timer);
        done(Boolean(window.Razorpay));
      }
    }, 100);
  });
}

/* ───────── Product Ticket Canvas Generator (2x Retina) ───────── */
function generateProductTicketCanvas(product: Product): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      const dpr = 2;
      const width = 560;
      const height = 640;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Clean White Card Background
      ctx.fillStyle = "#ffffff";
      const r = 24;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(width - r, 0);
      ctx.quadraticCurveTo(width, 0, width, r);
      ctx.lineTo(width, height - r);
      ctx.quadraticCurveTo(width, height, width - r, height);
      ctx.lineTo(r, height);
      ctx.quadraticCurveTo(0, height, 0, height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fill();

      // Card Outer Border
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top Slate Header Strip
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(width - r, 0);
      ctx.quadraticCurveTo(width, 0, width, r);
      ctx.lineTo(width, 68);
      ctx.lineTo(0, 68);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fill();

      // Top Gradient Accent Stripe
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, "#f59e0b");
      grad.addColorStop(0.5, "#ec4899");
      grad.addColorStop(1, "#8b5cf6");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, 5);

      // Store Title Branding
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("⚡ AJITDEV STORE", 24, 42);

      // Verified Seller Badge
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("✓ VERIFIED SELLER", 200, 42);

      // In Stock Green Pill
      ctx.fillStyle = "#10b981";
      if (typeof (ctx as any).roundRect === "function") {
        (ctx as any).roundRect(width - 116, 24, 92, 26, 13);
        ctx.fill();
      } else {
        ctx.fillRect(width - 116, 24, 92, 26);
      }
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("IN STOCK", width - 100, 41);

      // Product Image Container Box
      ctx.fillStyle = "#f8fafc";
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      if (typeof (ctx as any).roundRect === "function") {
        (ctx as any).roundRect(24, 86, width - 48, 270, 16);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(24, 86, width - 48, 270);
        ctx.strokeRect(24, 86, width - 48, 270);
      }

      const img = new (window.Image as any)();
      img.crossOrigin = "anonymous";
      let isDone = false;

      const finishCanvas = () => {
        if (isDone) return;
        isDone = true;
        renderDetailsAndExport(ctx);
      };

      img.onload = () => {
        try {
          const maxW = width - 96;
          const maxH = 230;
          let drawW = img.width || 200;
          let drawH = img.height || 200;
          const ratio = Math.min(maxW / drawW, maxH / drawH);
          drawW = drawW * ratio;
          drawH = drawH * ratio;
          const drawX = 24 + (width - 48 - drawW) / 2;
          const drawY = 86 + (270 - drawH) / 2;
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          finishCanvas();
        } catch {
          drawCategoryEmblem(ctx);
          finishCanvas();
        }
      };

      img.onerror = () => {
        drawCategoryEmblem(ctx);
        finishCanvas();
      };

      // Timeout fallback in case image hangs
      setTimeout(() => {
        if (!isDone) {
          drawCategoryEmblem(ctx);
          finishCanvas();
        }
      }, 1500);

      img.src = product.image[0];

      function drawCategoryEmblem(c: CanvasRenderingContext2D) {
        c.fillStyle = "#6366f1";
        c.font = "bold 40px sans-serif";
        c.textAlign = "center";
        c.fillText(categoryLabels[product.category] || "AJITDEV Store", width / 2, 235);
        c.textAlign = "start";
      }

      function renderDetailsAndExport(c: CanvasRenderingContext2D) {
        // Category Pill
        c.fillStyle = "#e0e7ff";
        if (typeof (c as any).roundRect === "function") {
          (c as any).roundRect(24, 376, 120, 24, 6);
          c.fill();
        } else {
          c.fillRect(24, 376, 120, 24);
        }
        c.fillStyle = "#4338ca";
        c.font = "bold 11px sans-serif";
        c.fillText(
          (categoryLabels[product.category] || product.category).toUpperCase(),
          34,
          392
        );

        // Product Title
        c.fillStyle = "#0f172a";
        c.font = "bold 21px sans-serif";
        const titleText =
          product.title.length > 42
            ? product.title.substring(0, 40) + "..."
            : product.title;
        c.fillText(titleText, 24, 430);

        // Star Rating
        c.fillStyle = "#f59e0b";
        c.font = "bold 14px sans-serif";
        c.fillText(
          `★ ${product.rating.rate.toFixed(1)}  (${product.rating.count} verified reviews)`,
          24,
          460
        );

        // Thin Separator Line
        c.strokeStyle = "#e2e8f0";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(24, 484);
        c.lineTo(width - 24, 484);
        c.stroke();

        // USD Price
        c.fillStyle = "#0f172a";
        c.font = "900 36px monospace, sans-serif";
        c.fillText(`$${product.price.toFixed(2)}`, 24, 536);

        // Converted INR Price
        const inr = (product.price * USD_TO_INR_RATE).toFixed(2);
        c.fillStyle = "#64748b";
        c.font = "bold 15px sans-serif";
        c.fillText(`(₹${inr} INR)`, 190, 532);

        // Add to Cart Button Graphic
        c.fillStyle = "#fffbeb";
        c.strokeStyle = "#f59e0b";
        c.lineWidth = 2;
        if (typeof (c as any).roundRect === "function") {
          (c as any).roundRect(width - 156, 502, 132, 42, 21);
          c.fill();
          c.stroke();
        } else {
          c.fillRect(width - 156, 502, 132, 42);
          c.strokeRect(width - 156, 502, 132, 42);
        }

        c.fillStyle = "#0f172a";
        c.font = "bold 14px sans-serif";
        c.fillText("+ Buy on Store", width - 142, 528);

        // Watermark Footer with Guarantee
        c.fillStyle = "#94a3b8";
        c.font = "11px sans-serif";
        c.fillText(
          "🔒 100% Authentic • Instant Delivery • next.ajitdev.com/store",
          24,
          604
        );

        try {
          canvas.toBlob((b) => resolve(b), "image/png");
        } catch {
          resolve(null);
        }
      }
    } catch {
      resolve(null);
    }
  });
}

/* ───────── Product Share & Screenshot Dialog ───────── */
function ProductShareDialog({
  product,
  open,
  onClose,
  screenshotUrl,
  screenshotBlob,
  isCapturing,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  screenshotUrl: string | null;
  screenshotBlob: Blob | null;
  isCapturing: boolean;
}) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [isCopiedImage, setIsCopiedImage] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  React.useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.canShare === "function") {
      try {
        const testFile = new File([""], "test.png", { type: "image/png" });
        setCanNativeShare(navigator.canShare({ files: [testFile] }));
      } catch {
        setCanNativeShare(false);
      }
    }
  }, []);

  if (!product) return null;

  const inrPrice = (product.price * USD_TO_INR_RATE).toFixed(2);
  const productShareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/store?product=${product.id}`
      : `https://next.ajitdev.com/store?product=${product.id}`;

  const handleNativeShare = async () => {
    if (!screenshotBlob) return;
    try {
      const file = new File(
        [screenshotBlob],
        `AJITDEV-Store-${product.title.replace(/[^a-zA-Z0-9]/g, "-")}.png`,
        { type: "image/png" }
      );
      if (navigator.share) {
        await navigator.share({
          title: `${product.title} | AJITDEV Store`,
          text: `Check out ${product.title} on AJITDEV Store for $${product.price.toFixed(2)} (₹${inrPrice})!`,
          url: productShareUrl,
          files: [file],
        });
        toast.success("Shared successfully! 🚀");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.warn("Native share error:", err);
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = `🛍️ *${product.title}*\n💰 Price: *$${product.price.toFixed(2)} (₹${inrPrice} INR)*\n⭐ Rating: ${product.rating.rate} / 5 (${product.rating.count} reviews)\n⚡ Category: ${categoryLabels[product.category] || product.category}\n\n👉 View & Buy on AJITDEV Store:\n${productShareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleTelegramShare = () => {
    const text = `🛍️ ${product.title}\n💰 Price: $${product.price.toFixed(2)} (₹${inrPrice})\n⭐ Rating: ${product.rating.rate}/5\n`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(productShareUrl)}&text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleTwitterShare = () => {
    const text = `Check out "${product.title}" on AJITDEV Store ($${product.price.toFixed(2)} / ₹${inrPrice})!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productShareUrl)}`,
      "_blank"
    );
  };

  const handleCopyImage = async () => {
    if (!screenshotBlob) return;
    try {
      if (typeof window !== "undefined" && window.ClipboardItem && navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": screenshotBlob }),
        ]);
        setIsCopiedImage(true);
        setTimeout(() => setIsCopiedImage(false), 2500);
        toast.success("Product Snapshot Copied! 📋", {
          description: "Copied image to clipboard. Paste (Ctrl+V) directly into WhatsApp, Telegram, or Discord!",
        });
      } else {
        handleDownload();
        toast.info("Image downloaded to device! 📥", {
          description: "Direct clipboard image copy not supported on this browser.",
        });
      }
    } catch (err) {
      console.warn("Clipboard write failed:", err);
      handleDownload();
      toast.info("Image downloaded! 📥", {
        description: "Browser prevented direct clipboard paste. Saved to downloads!",
      });
    }
  };

  const handleDownload = () => {
    if (!screenshotUrl) return;
    const a = document.createElement("a");
    a.href = screenshotUrl;
    a.download = `AJITDEV-Store-${product.title.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Product Snapshot Downloaded! 📥", {
      description: "Saved image to your downloads folder.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productShareUrl);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2500);
    toast.success("Product Link Copied! 🔗", {
      description: "Ready to paste & share anywhere.",
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[130] w-[94vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl overflow-hidden focus:outline-none animate-in fade-in-0 zoom-in-95 duration-200 border border-slate-100 max-h-[92vh] flex flex-col">
          {/* Top Rainbow Accent Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 shrink-0" />

          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <Dialog.Title className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                    Share Product Snapshot
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500 truncate max-w-[240px] sm:max-w-[280px]">
                    {product.title} • ${product.price.toFixed(2)} (₹{inrPrice})
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer active:scale-90"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Screenshot Preview Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                <span>📸 Snapshot Card</span>
                {isCapturing ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1.5 lowercase text-xs">
                    <Loader2 className="h-3 w-3 animate-spin" /> generating...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    HD Ready
                  </span>
                )}
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-gradient-to-b from-slate-100/70 to-slate-50 p-2.5 shadow-inner flex items-center justify-center min-h-[180px]">
                {isCapturing ? (
                  <div className="h-44 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                    <span>Rendering 2x HD snapshot card...</span>
                  </div>
                ) : screenshotUrl ? (
                  <div className="relative group w-full flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshotUrl}
                      alt={product.title}
                      className="w-auto h-auto object-contain max-h-52 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-white shadow-xs">
                        ✨ 2x Retina Snapshot
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                    Snapshot ready to share
                  </div>
                )}
              </div>
            </div>

            {/* Live Copy Feedback Notification Banner */}
            {isCopiedImage && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">Image Copied!</span> Paste (Ctrl+V) directly into WhatsApp, Telegram, Discord, or Email.
                </div>
              </div>
            )}
            {isCopiedLink && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold">Direct Link Copied!</span> Ready to share with your friends.
                </div>
              </div>
            )}

            {/* Action Buttons Section */}
            <div className="space-y-2.5 pt-1">
              {/* Native Share to Apps Button (if mobile/device supported) */}
              {canNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-xs sm:text-sm transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Share2 className="h-4 w-4 text-slate-950" />
                  <span>Share to Apps (WhatsApp, AirDrop, Nearby...)</span>
                </button>
              )}

              {/* Hero Copy Snapshot Image Button */}
              <button
                type="button"
                onClick={handleCopyImage}
                className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  isCopiedImage
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-300 scale-[1.01]"
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                }`}
              >
                {isCopiedImage ? (
                  <>
                    <Check className="h-4 w-4 text-white animate-bounce" />
                    <span>✓ Snapshot Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 text-amber-300" />
                    <span>Copy Snapshot Image</span>
                    <span className="text-[10px] text-slate-300 font-normal hidden xs:inline">
                      (Paste in chat)
                    </span>
                  </>
                )}
              </button>

              {/* Channels 4-Button Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.584 1.802.814 2.791.815 3.183 0 5.769-2.586 5.769-5.766.001-3.182-2.585-5.768-5.77-5.768zm0-2c4.288 0 7.769 3.481 7.769 7.768 0 4.288-3.481 7.769-7.769 7.769-1.328 0-2.576-.341-3.666-.938l-4.365 1.144 1.164-4.254c-.655-1.127-1.028-2.434-1.028-3.721 0-4.287 3.481-7.768 7.769-7.768zm3.626 10.974c-.152.428-.883.824-1.229.873-.346.049-.787.072-2.316-.549-1.807-.735-2.973-2.56-3.064-2.679-.091-.121-.734-.977-.734-1.864 0-.886.465-1.323.63-1.492.166-.169.362-.211.482-.211.121 0 .241 0 .346.006.111.006.26.042.392.361.136.327.465 1.134.506 1.217.041.083.069.181.014.289-.055.109-.083.177-.166.273-.083.096-.174.214-.249.288-.083.082-.17.171-.073.337.097.166.432.713.926 1.153.636.566 1.172.741 1.338.824.166.083.264.069.362-.042.098-.111.422-.491.534-.659.113-.168.225-.14.377-.084.151.056.963.454 1.129.537.166.083.276.124.317.194.041.069.041.401-.111.829z" />
                  </svg>
                  <span>WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={handleTelegramShare}
                  className="py-2.5 px-2 rounded-2xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z" />
                  </svg>
                  <span>Telegram</span>
                </button>

                {/* 𝕏 Post */}
                <button
                  type="button"
                  onClick={handleTwitterShare}
                  className="py-2.5 px-2 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs transition border border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="font-black text-sm">𝕏</span>
                  <span>Post on 𝕏</span>
                </button>

                {/* Download */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="py-2.5 px-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Download className="h-4 w-4 text-slate-700 shrink-0" />
                  <span>Save .png</span>
                </button>
              </div>

              {/* Direct Product Link Bar with Integrated Copy Button */}
              <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <Link2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-600 truncate font-mono text-[11px] flex-1">
                  {productShareUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`shrink-0 py-1.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                    isCopiedLink
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
                  }`}
                >
                  {isCopiedLink ? (
                    <>
                      <Check className="h-3 w-3 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ───────── Checkout Modal (Radix Dialog) ───────── */
function CheckoutDialog({
  open,
  onClose,
  onOrderSuccess,
  total,
  subtotal,
  discount,
  shipping,
  tax,
  items,
}: {
  open: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  items: RootState["cart"]["items"];
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatusText, setSubmitStatusText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 96.33x USD to INR conversion
  const amountInINR = Number((total * USD_TO_INR_RATE).toFixed(2));

  // Preload Razorpay Checkout script when modal opens
  React.useEffect(() => {
    loadRazorpayScript();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setErrorMsg("Please fill in all shipping details.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (items.length === 0 || total <= 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    // Direct Online Razorpay Payment flow
    try {
      setSubmitStatusText("Connecting to Razorpay...");

      // 1. Ensure Razorpay SDK is ready
      const isScriptReady = await loadRazorpayScript();
      if (!isScriptReady || !window.Razorpay) {
        throw new Error(
          "Razorpay Checkout script could not be loaded. If you have an ad-blocker enabled (such as Brave Shields or uBlock), please disable it and try again."
        );
      }

      // 2. Request order initialization on server with 96.33x converted amount
      setSubmitStatusText("Creating Secure Order...");
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInINR,
          customer: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            contact: formData.phone.trim() || "9876543210",
          },
          notes: {
            source: "store-checkout",
            itemsCount: items.length,
            shippingAddress: `${formData.address.trim()}, ${formData.city.trim()}`,
            gateway: "Razorpay Direct",
            usdTotal: `$${total.toFixed(2)}`,
            conversionRate: `1 USD = ₹${USD_TO_INR_RATE} (96.33x)`,
            inrTotal: `₹${amountInINR.toFixed(2)}`,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(
          orderData.message || "Failed to initialize payment order on server."
        );
      }

      const logoUrl =
        typeof window !== "undefined" && window.location.protocol === "https:"
          ? `${window.location.origin}/logo.png`
          : "https://next.ajitdev.com/logo.png";

      // 3. Configure Razorpay checkout options
      const options: RazorpayOptions = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "AJITDEV Store",
        description: `Order checkout for ${items.length} ${
          items.length === 1 ? "product" : "products"
        } (₹${amountInINR.toFixed(2)})`,
        image: logoUrl,
        order_id: orderData.orderId,
        handler: async (response) => {
          setSubmitStatusText("Verifying Payment...");
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              // Payment verified successfully!
              const newOrder: Order = {
                id: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
                  .toString(36)
                  .substring(2, 6)
                  .toUpperCase()}`,
                date: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                items: [...items],
                subtotal,
                discount,
                shipping,
                tax,
                total: amountInINR,
                totalUSD: total,
                exchangeRate: USD_TO_INR_RATE,
                paymentMethod: `Razorpay Online (${response.razorpay_payment_id})`,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                customer: { ...formData },
                status: "Confirmed",
              };

              dispatch(placeOrder(newOrder));
              setIsSubmitting(false);
              setSubmitStatusText("");
              toast.success("Order Placed Successfully! 🎉", {
                description: `Order #${newOrder.id} has been confirmed.`,
              });
              onClose();
              onOrderSuccess(newOrder);
              fireConfetti();
            } else {
              setIsSubmitting(false);
              setSubmitStatusText("");
              setErrorMsg(
                verifyData.message ||
                "Payment verification failed. Please try again."
              );
            }
          } catch (verifyErr: unknown) {
            setIsSubmitting(false);
            setSubmitStatusText("");
            const msg =
              verifyErr instanceof Error
                ? verifyErr.message
                : "Payment verification failed. Please try again.";
            setErrorMsg(msg);
          }
        },
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact: formData.phone.trim() || "9876543210",
        },
        theme: {
          color: "#0f172a",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setSubmitStatusText("");
          },
          escape: true,
          backdropclose: false,
        },
      };

      // 4. Open Razorpay checkout modal
      const rzp = new window.Razorpay(options);
      rzp.on?.("payment.failed", (resp: unknown) => {
        const errObj = resp as { error?: { description?: string } } | undefined;
        setErrorMsg(
          errObj?.error?.description || "Payment failed or was cancelled."
        );
        setIsSubmitting(false);
        setSubmitStatusText("");
      });

      setSubmitStatusText("Awaiting Razorpay Payment...");
      rzp.open();
    } catch (err: unknown) {
      console.error("Razorpay order initiation error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to initialize Razorpay payment. Please try again.";
      setErrorMsg(msg);
      setIsSubmitting(false);
      setSubmitStatusText("");
    }
  };

  return (
    <Dialog.Root open={open} modal={false} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
        <Dialog.Content
          onInteractOutside={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          onFocusOutside={(e) => {
            e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          className="fixed left-1/2 top-1/2 z-[130] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl overflow-hidden focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150 p-0 border border-slate-100 max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Secure Checkout
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-400">
                  Enter details to finalize your order
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close
              disabled={isSubmitting}
              className="h-8 w-8 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-slate-900 transition focus:outline-none disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3.5">
            {errorMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs font-semibold text-rose-600">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                placeholder="e.g. Ajit Kumar"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g. ajit@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  disabled={isSubmitting}
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="123 Main Road"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="New Delhi"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Direct Razorpay Gateway Trust Banner */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight text-[11px]">
                    Direct Payment via Razorpay
                  </p>
                  <p className="text-[10px] text-slate-500">
                    UPI · Credit/Debit Cards · NetBanking · Wallets
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                100% Secure
              </span>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>
                  Subtotal ({items.length} {items.length === 1 ? "product" : "products"}
                  {items.reduce((s, i) => s + i.quantity, 0) !== items.length
                    ? `, ${items.reduce((s, i) => s + i.quantity, 0)} units`
                    : ""})
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Savings</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                <span>Cart Total</span>
                <span className="font-semibold">${total.toFixed(2)} USD</span>
              </div>

              {/* Currency conversion rate badge (96.33x) */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px]">
                <span className="text-amber-900 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse inline-block"></span>
                  Currency Conversion:
                </span>
                <span className="font-mono font-black text-amber-900">
                  1 USD = ₹{USD_TO_INR_RATE} (96.33x)
                </span>
              </div>

              <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <div>
                  <span className="text-slate-900 font-bold">Total Payable</span>
                  <span className="block text-[10px] font-normal text-slate-400">
                    Charged in INR via Razorpay
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base text-emerald-600 font-extrabold">
                    ₹{amountInINR.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-98 disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                  <span>{submitStatusText || "Connecting to Razorpay..."}</span>
                </span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>
                    Pay Now via Razorpay (₹{amountInINR.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · ${total.toFixed(2)})
                  </span>
                </>
              )}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ───────── Order Success Dialog (Radix Dialog) ───────── */
function OrderSuccessDialog({
  order,
  onClose,
  onViewOrders,
}: {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
}) {
  if (!order) return null;

  return (
    <Dialog.Root open={Boolean(order)} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[160] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl p-7 text-center focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150 border border-slate-100">
          <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-1">
            <PartyPopper className="h-4 w-4 text-amber-500" />
            <Dialog.Title className="text-xl font-black text-slate-900">
              Order Confirmed!
            </Dialog.Title>
            <PartyPopper className="h-4 w-4 text-amber-500 -scale-x-100" />
          </div>

          <Dialog.Description className="text-xs font-mono font-bold text-slate-400 mb-3">
            Order ID: #{order.id}
          </Dialog.Description>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 text-left text-xs space-y-1.5 mb-5">
            <div className="flex justify-between text-slate-600">
              <span>Customer:</span>
              <strong className="text-slate-900">{order.customer.name}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Destination:</span>
              <strong className="text-slate-900">{order.customer.city}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Method:</span>
              <strong className="text-slate-900 truncate max-w-[200px]">
                {order.paymentMethod}
              </strong>
            </div>
            {order.paymentId && (
              <div className="flex justify-between items-center text-slate-600 pt-1.5 border-t border-slate-200/60">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Razorpay Verified:
                </span>
                <span className="font-mono font-bold text-slate-900 text-[11px] select-all">
                  {order.paymentId}
                </span>
              </div>
            )}
            <div className="flex justify-between items-baseline text-slate-900 font-black text-xs pt-1.5 border-t border-slate-200">
              <div>
                <span>Total Paid:</span>
                {order.totalUSD && (
                  <span className="block text-[10px] font-normal text-slate-400">
                    Converted at 1 USD = ₹{order.exchangeRate ?? USD_TO_INR_RATE} (96.33x)
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-emerald-600 font-extrabold text-sm">
                  ₹{(order.totalUSD ? order.total : (order.total * USD_TO_INR_RATE)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {order.totalUSD && (
                  <span className="block text-[10px] font-medium text-slate-500">
                    (${order.totalUSD.toFixed(2)} USD)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-98 cursor-pointer"
            >
              View in Order History
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ───────── Cart Drawer (Radix Dialog) ───────── */
function CartDrawer({
  open,
  onClose,
  onOpenCheckout,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
  onToast: (msg: string) => void;
}) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const appliedCoupon = useSelector(
    (state: RootState) => state.cart.appliedCoupon
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const productsCount = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return (subtotal * appliedCoupon.discountPercent) / 100;
  }, [subtotal, appliedCoupon]);

  const isFreeShipCoupon = appliedCoupon?.code === "FREESHIP";
  const shipping = subtotal === 0 || subtotal >= 99 || isFreeShipCoupon ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const grandTotal = Math.max(0, subtotal - discount + shipping + tax);

  const handleApplyCoupon = (codeToApply?: string) => {
    const target = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError("");

    const matched = availableCoupons.find((c) => c.code === target);
    if (!matched) {
      setCouponError("Invalid coupon code. Try DEV10 or SUPER20!");
      return;
    }

    dispatch(
      applyCoupon({
        code: matched.code,
        discountPercent: matched.discount,
      })
    );
    setCouponCode("");
    toast.success(`Coupon "${matched.code}" applied! 🎉`, {
      description:
        matched.discount > 0
          ? `${matched.discount}% discount applied.`
          : "Free shipping unlocked.",
    });
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
          <Dialog.Content className="fixed top-0 right-0 bottom-0 z-[90] w-full max-w-md bg-white shadow-2xl flex flex-col focus:outline-none transition-transform animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Dialog.Title className="text-base font-bold text-slate-900">
                    Your Cart
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-400">
                    {productsCount} {productsCount === 1 ? "product" : "products"}
                    {totalUnits !== productsCount
                      ? ` (${totalUnits} ${totalUnits === 1 ? "unit" : "units"})`
                      : ""}{" "}
                    • Persisted in Redux
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition focus:outline-none">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="px-6 py-2.5 bg-indigo-50/70 border-b border-indigo-100/50">
                <div className="flex items-center justify-between text-xs text-indigo-950 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-indigo-600" />
                    {subtotal >= 99 || isFreeShipCoupon
                      ? "You unlocked FREE Shipping!"
                      : `Add $${(99 - subtotal).toFixed(2)} more for FREE shipping`}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold">
                    {subtotal >= 99 || isFreeShipCoupon
                      ? "100%"
                      : `${Math.min(100, Math.round((subtotal / 99) * 100))}%`}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-indigo-200/60 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${isFreeShipCoupon
                        ? 100
                        : Math.min(100, (subtotal / 99) * 100)
                        }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="h-16 w-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                    <ShoppingCart className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Cart is empty
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Your cart items stay saved in Redux even when you refresh the
                    page!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3 items-center transform-gpu transition hover:border-slate-200"
                    >
                      <div className="h-14 w-14 shrink-0 rounded-xl bg-white flex items-center justify-center p-2 border border-slate-100">
                        <Image
                          src={item.product.image[0]}
                          alt={item.product.title}
                          width={46}
                          height={46}
                          className="object-contain max-h-12"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.title}
                        </h4>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-slate-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              (${item.product.price.toFixed(2)} × {item.quantity})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.product.id,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                            className="h-6 w-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-900 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              dispatch(
                                updateQuantity({
                                  id: item.product.id,
                                  quantity: item.quantity + 1,
                                })
                              );
                              toast.success(`Updated quantity (${item.quantity + 1})`, {
                                description: `"${item.product.title}"`,
                              });
                            }}
                            className="h-6 w-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          dispatch(removeFromCart(item.product.id));
                          toast.info("Removed from Cart", {
                            description: `"${item.product.title}" removed from your cart.`,
                          });
                        }}
                        className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Checkout */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50 space-y-3">
                {/* Coupon Box */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Coupon (e.g. DEV10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-indigo-500 uppercase font-mono"
                      />
                    </div>
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400">Try:</span>
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        {c.code} ({c.label})
                      </button>
                    ))}
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {couponError}
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-800">
                      <span className="font-bold flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-600" />
                        &quot;{appliedCoupon.code}&quot; Active (
                        {appliedCoupon.discountPercent}% OFF)
                      </span>
                      <button
                        onClick={() => {
                          dispatch(removeCoupon());
                          toast.info("Coupon removed", {
                            description: `Coupon "${appliedCoupon.code}" was removed.`,
                          });
                        }}
                        className="text-emerald-700 hover:text-rose-600 text-[11px] font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1 text-xs pt-1 border-t border-slate-200/60">
                  <div className="flex justify-between text-slate-500">
                    <span>
                      Subtotal ({totalUnits} {totalUnits === 1 ? "unit" : "units"})
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                    <div>
                      <span>Total</span>
                      <span className="block text-[10px] font-normal text-slate-400">
                        1 USD = ₹{USD_TO_INR_RATE} (96.33x)
                      </span>
                    </div>
                    <div className="text-right">
                      <span>${grandTotal.toFixed(2)}</span>
                      <span className="block text-[11px] font-bold text-emerald-600">
                        ≈ ₹{(grandTotal * USD_TO_INR_RATE).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>
                    Proceed to Checkout (${grandTotal.toFixed(2)} · ₹{(grandTotal * USD_TO_INR_RATE).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </span>
                </button>
                <button
                  onClick={() => setConfirmClearOpen(true)}
                  className="w-full rounded-xl py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition text-center"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="Clear Shopping Cart?"
        description="Are you sure you want to remove all items from your cart? Items in your Wishlist will not be affected."
        confirmText="Yes, Clear Cart"
        cancelText="Cancel"
        onConfirm={() => {
          dispatch(clearCart());
          toast.info("Cart cleared", {
            description: "All items have been removed from your cart.",
          });
        }}
      />
    </>
  );
}

/* ───────── Amazon-Style Yellow Pill Cart Button ───────── */
const CartPillButton = React.memo(function CartPillButton({
  product,
  onToast,
  compact = false,
}: {
  product: Product;
  onToast?: (msg: string) => void;
  compact?: boolean;
}) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((i) => i.product.id === product.id)
  );
  const quantity = cartItem?.quantity || 0;

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(addToCart(product));
          toast.success("Added to Cart! 🛒", {
            description: `"${product.title}" • $${product.price.toFixed(2)}`,
          });
        }}
        className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full border-2 bg-white hover:bg-amber-50 text-slate-900 font-bold transition-all active:scale-95 shadow-xs cursor-pointer ${
          compact ? "px-2.5 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-xs" : "px-4 py-2 text-xs"
        }`}
        style={{ borderColor: "#F7CA00" }}
        title="Add to cart"
      >
        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-900" />
        <span>Add{compact ? "" : " to Cart"}</span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-between rounded-full border-2 bg-white shadow-xs text-slate-900 select-none max-w-full transition-all animate-in fade-in-0 zoom-in-95 duration-150 ${
        compact
          ? "px-1.5 py-0.5 sm:px-2.5 sm:py-1 min-w-[92px] sm:min-w-[125px]"
          : "px-2.5 py-1 min-w-[130px]"
      }`}
      style={{ borderColor: "#F7CA00" }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (quantity <= 1) {
            dispatch(removeFromCart(product.id));
            toast.info("Removed from Cart", {
              description: `"${product.title}"`,
            });
          } else {
            dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
            toast.info(`Updated quantity (${quantity - 1})`, {
              description: `"${product.title}"`,
            });
          }
        }}
        className="h-5 w-5 sm:h-6 sm:w-6 rounded-full text-slate-800 hover:text-rose-600 hover:bg-amber-100/50 active:scale-90 transition cursor-pointer flex items-center justify-center shrink-0"
        title={quantity <= 1 ? "Remove from cart" : "Decrease quantity"}
        aria-label={quantity <= 1 ? "Remove from cart" : "Decrease quantity"}
      >
        {quantity <= 1 ? (
          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-900" />
        ) : (
          <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-900" />
        )}
      </button>

      <span className="text-[10px] sm:text-xs font-semibold text-slate-900 px-1 sm:px-2 tracking-tight text-center whitespace-nowrap">
        {quantity} in cart
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
          toast.success(`Updated quantity (${quantity + 1})`, {
            description: `"${product.title}"`,
          });
        }}
        className="h-5 w-5 sm:h-6 sm:w-6 rounded-full text-slate-800 hover:text-slate-950 hover:bg-amber-100/50 active:scale-90 transition cursor-pointer flex items-center justify-center shrink-0"
        title="Increase quantity"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-900" />
      </button>
    </div>
  );
});

/* ───────── Memoized Product Card (Grid) ───────── */
const ProductCard = React.memo(function ProductCard({
  product,
  isLiked,
  onQuickView,
  onToast,
  onShare,
}: {
  product: Product;
  isLiked: boolean;
  onQuickView: (p: Product) => void;
  onToast: (msg: string) => void;
  onShare: (p: Product, node?: HTMLElement | null) => void;
}) {
  const dispatch = useDispatch();
  const cardRef = React.useRef<HTMLElement>(null);

  const handleWishlist = () => {
    const nextLiked = !isLiked;
    dispatch(toggleWishlist(product.id));
    if (nextLiked) {
      toast.success("Added to Wishlist ❤️", {
        description: `"${product.title}" saved to your favorites.`,
      });
    } else {
      toast.info("Removed from Wishlist", {
        description: `"${product.title}" removed from your favorites.`,
      });
    }
  };

  return (
    <article
      ref={cardRef}
      className="group relative flex flex-col rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-slate-200 transition-all duration-200 transform-gpu hover:-translate-y-0.5 overflow-hidden"
    >
      {product.rating.rate >= 4.5 && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white shadow-xs pointer-events-none">
          <TrendingUp className="h-2.5 w-2.5" />
          <span className="hidden xs:inline">Top</span>
        </div>
      )}

      {/* Top Right: Share & Wishlist Floating Glass Pill */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex items-center gap-0.5 p-0.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs transition-all duration-200">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShare(product, cardRef.current);
          }}
          title="Share product snapshot"
          aria-label="Share product"
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-slate-500 hover:text-amber-600 hover:bg-amber-50/80 flex items-center justify-center transition cursor-pointer active:scale-90"
        >
          <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        <span className="h-3.5 w-[1px] bg-slate-200/80" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist();
          }}
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition cursor-pointer active:scale-90 ${
            isLiked
              ? "bg-rose-50 text-rose-500 shadow-2xs"
              : "text-slate-400 hover:text-rose-500 hover:bg-rose-50/80"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      <div
        className="relative flex items-center justify-center h-36 sm:h-52 overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-br from-slate-50 via-white to-slate-50 p-3 sm:p-6 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <Image
          src={product.image[0]}
          alt={product.title}
          width={180}
          height={180}
          className="object-contain max-h-28 sm:max-h-36 transition-transform duration-300 group-hover:scale-105 transform-gpu"
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3 pointer-events-none hidden sm:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-semibold text-slate-800 shadow-md">
            <Eye className="h-3 w-3" />
            Quick View
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-5">
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-0.5 sm:mb-1 truncate">
          {categoryLabels[product.category]}
        </span>
        <h3
          onClick={() => onQuickView(product)}
          className="text-[11px] sm:text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1 sm:mb-2 min-h-[1.8rem] sm:min-h-[2rem] cursor-pointer hover:text-indigo-600 transition"
        >
          {product.title}
        </h3>
        <div className="mb-1">
          <Stars rate={product.rating.rate} count={product.rating.count} />
        </div>

        <div className="mt-auto pt-2 sm:pt-3.5 flex flex-wrap items-center justify-between gap-1 border-t border-slate-100">
          <span className="text-xs sm:text-base font-black text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center">
            <CartPillButton product={product} onToast={onToast} compact />
          </div>
        </div>
      </div>
    </article>
  );
});

/* ───────── Memoized Product List Item (List) ───────── */
const ProductListItem = React.memo(function ProductListItem({
  product,
  isLiked,
  onQuickView,
  onToast,
  onShare,
}: {
  product: Product;
  isLiked: boolean;
  onQuickView: (p: Product) => void;
  onToast: (msg: string) => void;
  onShare: (p: Product) => void;
}) {
  const dispatch = useDispatch();

  const handleWishlist = () => {
    const nextLiked = !isLiked;
    dispatch(toggleWishlist(product.id));
    if (nextLiked) {
      toast.success("Added to Wishlist ❤️", {
        description: `"${product.title}" saved to your favorites.`,
      });
    } else {
      toast.info("Removed from Wishlist", {
        description: `"${product.title}" removed from your favorites.`,
      });
    }
  };

  return (
    <article className="group flex flex-col sm:flex-row items-center gap-4 rounded-3xl bg-white border border-slate-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-slate-200 transition-all duration-200 transform-gpu">
      <div
        className="relative h-32 w-32 shrink-0 rounded-2xl bg-slate-50 flex items-center justify-center p-3 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <Image
          src={product.image[0]}
          alt={product.title}
          width={110}
          height={110}
          className="object-contain max-h-24 transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
          sizes="110px"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
            {categoryLabels[product.category]}
          </span>
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-slate-900 leading-snug cursor-pointer hover:text-indigo-600 transition truncate mt-0.5"
          >
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="mt-2">
          <Stars rate={product.rating.rate} count={product.rating.count} />
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        <span className="text-xl font-black text-slate-900">
          ${product.price.toFixed(2)}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare(product);
              }}
              title="Share product snapshot"
              aria-label="Share product"
              className="h-8 w-8 rounded-full text-slate-500 hover:text-amber-600 hover:bg-amber-50/80 flex items-center justify-center transition cursor-pointer active:scale-90"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <span className="h-3.5 w-[1px] bg-slate-200/80" />
            <button
              onClick={handleWishlist}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition cursor-pointer active:scale-90 ${
                isLiked
                  ? "bg-rose-50 text-rose-500 shadow-2xs"
                  : "text-slate-400 hover:text-rose-500 hover:bg-rose-50/80"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`}
              />
            </button>
          </div>
          <CartPillButton product={product} onToast={onToast} />
        </div>
      </div>
    </article>
  );
});

/* ───────── Main Store Client ───────── */
export default function StoreClient({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);

  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [onlyTopRated, setOnlyTopRated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Real e-commerce Infinite Scroll: Load 20 first, auto-load next 20 on scroll
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Share Product state
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleShareProduct = useCallback(async (prod: Product, cardNode?: HTMLElement | null) => {
    setShareProduct(prod);
    setShareModalOpen(true);
    setIsCapturing(true);
    setScreenshotUrl(null);
    setScreenshotBlob(null);

    toast.info("Generating product snapshot card...", { duration: 1500 });

    try {
      let blob: Blob | null = await generateProductTicketCanvas(prod);
      let dataUrl: string | null = null;

      if (!blob && cardNode) {
        try {
          dataUrl = await toPng(cardNode, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
          });
          const res = await fetch(dataUrl);
          blob = await res.blob();
        } catch (captureErr) {
          console.warn("DOM toPng failed:", captureErr);
        }
      }

      if (blob) {
        if (!dataUrl) {
          dataUrl = URL.createObjectURL(blob);
        }
        setScreenshotBlob(blob);
        setScreenshotUrl(dataUrl);
        toast.success("HD Snapshot Ready to Share! 📸", {
          description: "Tap WhatsApp, Copy Image, or Share to Apps.",
        });
      } else {
        throw new Error("Could not generate snapshot");
      }
    } catch (err) {
      console.error("Product share error:", err);
      toast.error("Could not capture screenshot", {
        description: "Direct link is ready to share.",
      });
    } finally {
      setIsCapturing(false);
    }
  }, []);

  // Toast notifications (shadcn Sonner)
  const showToast = useCallback((msg: string) => {
    toast(msg);
  }, []);

  // Redux Selectors
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const orders = useSelector((state: RootState) => state.cart.orders);
  const appliedCoupon = useSelector(
    (state: RootState) => state.cart.appliedCoupon
  );

  const cartProductsCount = cartItems.length;
  const cartTotalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const ordersCount = orders.length;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return (subtotal * appliedCoupon.discountPercent) / 100;
  }, [subtotal, appliedCoupon]);
  const isFreeShip = appliedCoupon?.code === "FREESHIP" || subtotal >= 99;
  const shipping = subtotal === 0 || isFreeShip ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const grandTotal = Math.max(0, subtotal - discount + shipping + tax);

  // High-performance memoized product filter
  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    if (activeCategory !== "all") {
      const activeNorm = normalizeCatKey(activeCategory);
      result = result.filter((p) => {
        const pNorm = normalizeCatKey(p.category);
        return (
          p.category === activeCategory ||
          pNorm === activeNorm ||
          pNorm.includes(activeNorm) ||
          activeNorm.includes(pNorm)
        );
      });
    }

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (priceRange === "under-50") {
      result = result.filter((p) => p.price < 50);
    } else if (priceRange === "50-100") {
      result = result.filter((p) => p.price >= 50 && p.price <= 100);
    } else if (priceRange === "100-250") {
      result = result.filter((p) => p.price > 100 && p.price <= 250);
    } else if (priceRange === "250-plus") {
      result = result.filter((p) => p.price > 250);
    }

    if (onlyTopRated) {
      result = result.filter((p) => p.rating.rate >= 4.0);
    }

    switch (sortKey) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [activeCategory, deferredSearch, priceRange, onlyTopRated, sortKey]);

  // Paginated visible products for 60fps rendering
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Real e-commerce Infinite Scroll: auto-load next 20 products when user scrolls to 80%
  const isLoadingMoreRef = React.useRef(false);
  const visibleCountRef = React.useRef(visibleCount);
  visibleCountRef.current = visibleCount;
  const filteredProductsRef = React.useRef(filteredProducts);
  filteredProductsRef.current = filteredProducts;

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current) return;
    if (visibleCountRef.current >= filteredProductsRef.current.length) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + 20, filteredProductsRef.current.length)
      );
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
    }, 500);
  }, []);

  // 85% Scroll Listener: triggers loadMore when user scrolls 85% down the page
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;
        if (isLoadingMoreRef.current) return;
        if (visibleCountRef.current >= filteredProductsRef.current.length) return;

        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const clientHeight = window.innerHeight || doc.clientHeight;
        const scrollHeight = doc.scrollHeight;

        if (scrollHeight <= clientHeight) return;

        // Exactly 85% scroll threshold (0.85)
        const scrollPercent = (scrollTop + clientHeight) / scrollHeight;
        if (scrollPercent >= 0.85) {
          loadMore();
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  // IntersectionObserver backup for bottom sentinel
  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Reset to first 20 products whenever active filters or search change
  React.useEffect(() => {
    setVisibleCount(20);
  }, [deferredSearch, activeCategory, priceRange, onlyTopRated, sortKey]);

  const handleQuickView = useCallback((p: Product) => {
    setQuickViewProduct(p);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProducts.length };
    initialProducts.forEach((p) => {
      const pCat = p.category || "";
      const rawLower = pCat.toLowerCase().trim();
      counts[rawLower] = (counts[rawLower] || 0) + 1;
      counts[pCat] = (counts[pCat] || 0) + 1;
      const norm = normalizeCatKey(pCat);
      counts[norm] = (counts[norm] || 0) + 1;
    });

    // Also resolve counts for all static category keys
    categories.forEach((cat) => {
      if (cat === "all") return;
      if (counts[cat] !== undefined) return;
      const norm = normalizeCatKey(cat);
      if (counts[norm] !== undefined) {
        counts[cat] = counts[norm];
      } else {
        const foundKey = Object.keys(counts).find(
          (k) =>
            k !== "all" &&
            (normalizeCatKey(k) === norm ||
              normalizeCatKey(k).includes(norm) ||
              norm.includes(normalizeCatKey(k)))
        );
        if (foundKey) counts[cat] = counts[foundKey];
      }
    });

    return counts;
  }, [initialProducts]);

  const getCategoryCount = useCallback(
    (cat: string) => {
      if (cat === "all") return initialProducts.length;
      const catLower = cat.toLowerCase().trim();
      if (categoryCounts[catLower] !== undefined) return categoryCounts[catLower];
      if (categoryCounts[cat] !== undefined) return categoryCounts[cat];
      const norm = normalizeCatKey(cat);
      if (categoryCounts[norm] !== undefined) return categoryCounts[norm];
      return 0;
    },
    [categoryCounts, initialProducts.length]
  );

  const handleOrderPlaced = (order: Order) => {
    setCompletedOrder(order);
    setTimeout(() => fireConfetti(), 150);
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    searchQuery.trim() !== "" ||
    priceRange !== "all" ||
    onlyTopRated;

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setPriceRange("all");
    setOnlyTopRated(false);
    setSortKey("default");
    setVisibleCount(20);
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      {/* ─── Modern shadcn Toast managed globally via Sonner ─── */}

      {/* ─── Floating Control Dock ─── */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative h-12 w-12 rounded-2xl bg-white text-slate-800 border border-slate-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center"
            >
              <Heart className="h-5 w-5 text-rose-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-[200] rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md"
              side="left"
            >
              Wishlist ({wishlistCount})
              <Tooltip.Arrow className="fill-slate-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => setOrdersOpen(true)}
              className="relative h-12 w-12 rounded-2xl bg-white text-slate-800 border border-slate-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center"
            >
              <Receipt className="h-5 w-5 text-emerald-600" />
              {ordersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] rounded-full bg-emerald-600 text-[10px] font-black text-white flex items-center justify-center px-1">
                  {ordersCount}
                </span>
              )}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-[200] rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md"
              side="left"
            >
              Orders ({ordersCount})
              <Tooltip.Arrow className="fill-slate-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => setCartOpen(true)}
              className="relative h-14 w-14 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/25 flex items-center justify-center transition hover:bg-slate-800 hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartProductsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-6 min-w-[24px] rounded-full bg-indigo-600 text-[10px] font-black text-white flex items-center justify-center px-1.5 shadow-sm">
                  {cartProductsCount}
                </span>
              )}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-[200] rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md"
              side="left"
            >
              Cart ({cartProductsCount}{" "}
              {cartProductsCount === 1 ? "product" : "products"}
              {cartTotalUnits !== cartProductsCount
                ? ` • ${cartTotalUnits} units`
                : ""})
              <Tooltip.Arrow className="fill-slate-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 py-14 sm:py-20">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>50+ Curated Products • Free Shipping Over $99</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Redux Persisted (Refresh Safe)</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-3">
            E-comm{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Store
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-500 leading-relaxed mb-6">
            Ultra-smooth shopping experience powered by Redux & Radix UI. State
            is refresh-safe and never gets cleared.
          </p>

          {/* Quick Buttons */}
          <div className="flex items-center justify-center gap-2.5">
            <button
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>
                Cart ({cartProductsCount}
                {cartTotalUnits !== cartProductsCount
                  ? ` • ${cartTotalUnits} units`
                  : ""})
              </span>
            </button>
            <button
              onClick={() => setWishlistOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 text-slate-800 px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-slate-50 transition active:scale-95"
            >
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span>Wishlist ({wishlistCount})</span>
            </button>
            <button
              onClick={() => setOrdersOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 text-slate-800 px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-slate-50 transition active:scale-95"
            >
              <Receipt className="h-3.5 w-3.5 text-emerald-600" />
              <span>Orders ({ordersCount})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="mt-8 mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-xs transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Products Section ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Selector Bar — Radix Select Dropdown + Quick Pills */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Real E-Commerce Website Department Dropdown via Radix Select */}
              <Select.Root
                value={activeCategory}
                onValueChange={(val) => {
                  setActiveCategory(val as Category);
                  setVisibleCount(20);
                }}
              >
                <Select.Trigger
                  id="category-select"
                  aria-label="Select Category"
                  className="group inline-flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-xs hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.99] transition-all duration-150 cursor-pointer"
                >
                  {/* Category icon bubble */}
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-base leading-none group-hover:scale-105 transition-transform shrink-0">
                    {categoryIcons[activeCategory] ?? "🛍️"}
                  </span>

                  {/* Category title */}
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none mb-0.5">
                      Category
                    </span>
                    <span className="text-sm font-bold text-slate-900 leading-none">
                      <Select.Value placeholder="Select Category">
                        {categoryLabels[activeCategory] || "All Products"}
                      </Select.Value>
                    </span>
                  </div>

                  {/* Active count badge */}
                  <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                    {getCategoryCount(activeCategory)}
                  </span>

                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-200 ml-1 shrink-0" />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    position="popper"
                    sideOffset={8}
                    align="start"
                    className="z-[200] w-[320px] sm:w-[360px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/15 animate-in fade-in-0 zoom-in-95 duration-100"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5 bg-slate-50/70">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        All Departments
                      </span>
                      <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {categories.length} categories · {initialProducts.length} items
                      </span>
                    </div>

                    {/* Smooth scrolling viewport — native wheel/touch scrollable */}
                    <Select.Viewport className="max-h-[380px] overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                      {categories.map((cat) => {
                        const count = getCategoryCount(cat);
                        return (
                          <Select.Item
                            key={cat}
                            value={cat}
                            className="group relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors duration-75 data-[highlighted]:bg-slate-50 data-[state=checked]:bg-indigo-50/80 data-[state=checked]:text-indigo-900 text-slate-700"
                          >
                            {/* Emoji Icon container */}
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base shrink-0 group-data-[state=checked]:bg-indigo-100 transition-colors">
                              {categoryIcons[cat] ?? "🛍️"}
                            </span>

                            {/* Label */}
                            <Select.ItemText>
                              <span className="font-semibold text-slate-800 group-data-[state=checked]:font-bold group-data-[state=checked]:text-indigo-950">
                                {categoryLabels[cat] ?? cat}
                              </span>
                            </Select.ItemText>

                            {/* Count badge & Checkmark */}
                            <span className="ml-auto flex items-center gap-2 shrink-0">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500 group-data-[state=checked]:bg-indigo-100 group-data-[state=checked]:text-indigo-700 transition-colors">
                                {count}
                              </span>

                              <Select.ItemIndicator>
                                <Check className="h-4 w-4 text-indigo-600 stroke-[2.5]" />
                              </Select.ItemIndicator>
                            </span>
                          </Select.Item>
                        );
                      })}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

              {/* Quick Category Chips for Top Popular Departments */}
              <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
                {popularCategories.map((cat) => {
                  const isSelected = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat as Category);
                        setVisibleCount(20);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${isSelected
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <span>{categoryIcons[cat]}</span>
                      <span>{categoryLabels[cat]}</span>
                      <span
                        className={`text-[11px] font-bold ${isSelected ? "text-slate-300" : "text-slate-400"
                          }`}
                      >
                        {getCategoryCount(cat)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Reset active filter pill if not "all" */}
              {activeCategory !== "all" && (
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setVisibleCount(20);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 text-xs font-bold hover:bg-rose-100 transition active:scale-95"
                  title="Reset to All Products"
                >
                  <span>Clear Category</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 mb-7 bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs">
          {/* Price Range chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">
              Price:
            </span>
            {priceRanges.map((pr) => (
              <button
                key={pr.id}
                onClick={() => {
                  setPriceRange(pr.id);
                  setVisibleCount(20);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${priceRange === pr.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {pr.label}
              </button>
            ))}

            <button
              onClick={() => {
                setOnlyTopRated(!onlyTopRated);
                setVisibleCount(20);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${onlyTopRated
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
            >
              <Star className="h-3 w-3 fill-current" />
              <span>4★ & Up</span>
            </button>
          </div>

          {/* Right Controls: Sort with Radix Select & View mode */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <strong className="text-slate-900">
                {Math.min(visibleCount, filteredProducts.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-900">
                {filteredProducts.length}
              </strong>{" "}
              products
            </p>

            {/* Radix UI Select for Sorting */}
            <Select.Root
              value={sortKey}
              onValueChange={(v) => setSortKey(v as SortKey)}
            >
              <Select.Trigger className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 transition">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <Select.Value />
                <Select.Icon>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-[150] min-w-[190px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50">
                  <Select.Viewport>
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <Select.Item
                        key={key}
                        value={key}
                        className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-700 outline-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 transition"
                      >
                        <Select.ItemText>{label}</Select.ItemText>
                        <Select.ItemIndicator className="ml-auto">
                          <Check className="h-3.5 w-3.5 text-indigo-600" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-400 hover:text-slate-700"
                  }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition ${viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-400 hover:text-slate-700"
                  }`}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Clear Pill */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-5 text-xs text-slate-500">
            <span>Filtered results active.</span>
            <button
              onClick={resetFilters}
              className="font-bold text-indigo-600 hover:text-indigo-800 transition underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Product Grid / List Display */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No products found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Try adjusting your search query or filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
            {visibleProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-[fadeSlideUp_0.35s_ease_forwards] opacity-0"
                style={{ animationDelay: `${(i % 20) * 30}ms` }}
              >
                <ProductCard
                  product={product}
                  isLiked={wishlist.includes(product.id)}
                  onQuickView={handleQuickView}
                  onToast={showToast}
                  onShare={handleShareProduct}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-[fadeSlideUp_0.35s_ease_forwards] opacity-0"
                style={{ animationDelay: `${(i % 20) * 25}ms` }}
              >
                <ProductListItem
                  product={product}
                  isLiked={wishlist.includes(product.id)}
                  onQuickView={handleQuickView}
                  onToast={showToast}
                  onShare={handleShareProduct}
                />
              </div>
            ))}
          </div>
        )}

        {/* Skeleton cards while loading next batch */}
        {isLoadingMore && (
          <div className="mt-5">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeletonCard key={i} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonListItem key={i} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* IntersectionObserver Sentinel for Infinite Scroll */}
        {visibleCount < filteredProducts.length && (
          <div ref={sentinelRef} className="h-10 w-full pointer-events-none" />
        )}

        {/* All Products Loaded Status */}
        {filteredProducts.length > 0 &&
          visibleCount >= filteredProducts.length && (
            <div className="mt-12 flex flex-col items-center justify-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs text-slate-500 font-semibold shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  All {filteredProducts.length} curated products loaded
                </span>
              </div>
            </div>
          )}
      </section>

      {/* ─── Radix UI Modals & Drawers ─── */}

      <QuickViewDialog
        product={quickViewProduct}
        open={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onToast={showToast}
        onShare={handleShareProduct}
      />

      <ProductShareDialog
        product={shareProduct}
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        screenshotUrl={screenshotUrl}
        screenshotBlob={screenshotBlob}
        isCapturing={isCapturing}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onOpenCart={() => setCartOpen(true)}
        onToast={showToast}
        allProducts={initialProducts}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenCheckout={() => setCheckoutOpen(true)}
        onToast={showToast}
      />

      <OrdersDrawer
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        onToast={showToast}
      />

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderSuccess={handleOrderPlaced}
        items={cartItems}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        tax={tax}
        total={grandTotal}
      />

      <OrderSuccessDialog
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onViewOrders={() => setOrdersOpen(true)}
      />
    </Tooltip.Provider>
  );
}
