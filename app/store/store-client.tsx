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
} from "lucide-react";
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

/* ───────── Skeleton Shimmer Card ───────── */
function ProductSkeletonCard() {
  return (
    <div className="relative rounded-3xl bg-white border border-slate-100 overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent z-10 pointer-events-none" />
      {/* Image area */}
      <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200" />
      {/* Content area */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-slate-200 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-slate-200 rounded-lg" />
          <div className="h-4 w-3/4 bg-slate-200 rounded-lg" />
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 w-3 bg-slate-200 rounded-full" />
          ))}
          <div className="h-3 w-10 bg-slate-100 rounded ml-1" />
        </div>
        <div className="pt-1 flex items-center justify-between">
          <div className="h-6 w-16 bg-slate-200 rounded-lg" />
          <div className="h-8 w-8 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ───────── Star Rating ───────── */
function Stars({ rate, count }: { rate: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-px">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(1, Math.max(0, rate - i));
          return (
            <span key={i} className="relative h-3.5 w-3.5">
              <Star className="absolute inset-0 h-3.5 w-3.5 text-slate-200" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-[11px] font-medium text-slate-400">
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
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
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
    onToast(`Added ${qty} × "${product.title}" to cart!`);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product.id));
    onToast(isLiked ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[110] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl overflow-hidden focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150 p-0 border border-slate-100">
          <Dialog.Title className="sr-only">{product.title}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {product.description}
          </Dialog.Description>

          <Dialog.Close className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition shadow-xs focus:outline-none">
            <X className="h-4 w-4" />
          </Dialog.Close>

          <div className="flex flex-col sm:flex-row">
            <div className="relative h-64 sm:h-auto sm:w-1/2 bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/20 flex items-center justify-center p-8">
              <Image
                src={product.image[0]}
                alt={product.title}
                width={260}
                height={260}
                className="object-contain max-h-52 transform-gpu"
                priority
              />
              <button
                onClick={handleWishlist}
                className={`absolute top-4 left-4 h-9 w-9 rounded-full flex items-center justify-center transition ${
                  isLiked
                    ? "bg-rose-50 text-rose-500 shadow-xs"
                    : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                }`}
                title={isLiked ? "Remove wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-rose-500" : ""}`}
                />
              </button>
            </div>

            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full px-3 py-1 mb-2.5">
                  {categoryIcons[product.category]}{" "}
                  {categoryLabels[product.category]}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                  {product.title}
                </h3>
                <Stars rate={product.rating.rate} count={product.rating.count} />
                <p className="mt-3 text-xs text-slate-500 leading-relaxed max-h-28 overflow-y-auto">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">
                    ${(product.price * qty).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-slate-900">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={justAdded}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold shadow-md transition active:scale-98 ${
                    justAdded
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "bg-slate-900 text-white shadow-slate-900/15 hover:bg-slate-800"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> Add to Cart • $
                      {(product.price * qty).toFixed(2)}
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
    onToast(`Moved "${prod.title}" to Cart!`);
  };

  const handleMoveAllToCart = () => {
    dispatch(addAllWishlistToCart(wishlistProducts));
    onToast(`Moved all items to Cart!`);
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
                          onToast("Removed from wishlist");
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
    onToast(`Added all items from Order #${order.id} back to Cart!`);
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {ord.status}
                        </span>
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
                        <span>Total: ${ord.total.toFixed(2)}</span>
                        <button
                          onClick={() => handleReorder(ord)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-100 transition active:scale-95"
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
          onToast("Order history cleared");
        }}
      />
    </>
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
  });
  const [paymentMethod, setPaymentMethod] = useState("Credit / Debit Card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    setErrorMsg("");

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
      total,
      paymentMethod,
      customer: { ...formData },
      status: "Confirmed",
    };

    setTimeout(() => {
      dispatch(placeOrder(newOrder));
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(newOrder);
    }, 400);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[130] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl overflow-hidden focus:outline-none animate-in fade-in-0 zoom-in-95 duration-150 p-0 border border-slate-100 max-h-[90vh] flex flex-col">
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
            <Dialog.Close className="h-8 w-8 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-slate-900 transition focus:outline-none">
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
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ajit Kumar"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. ajit@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="123 Main Road"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  placeholder="New Delhi"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "Credit / Debit Card",
                    icon: CreditCard,
                    label: "Card",
                  },
                  { id: "UPI / QR Code", icon: QrCode, label: "UPI" },
                  { id: "Cash on Delivery", icon: Banknote, label: "COD" },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition text-center ${
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                          : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
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
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-98 disabled:opacity-75"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Confirm Order (${total.toFixed(2)})</span>
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

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 text-left text-xs space-y-1 mb-5">
            <div className="flex justify-between text-slate-600">
              <span>Customer:</span>
              <strong className="text-slate-900">{order.customer.name}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Destination:</span>
              <strong className="text-slate-900">{order.customer.city}</strong>
            </div>
            <div className="flex justify-between text-slate-900 font-black text-xs pt-1.5 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="text-emerald-600">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-98"
            >
              View in Order History
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
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
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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
    onToast(`Coupon "${matched.code}" applied!`);
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
                  {itemCount} {itemCount === 1 ? "item" : "items"} • Persisted in
                  Redux
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
                    width: `${
                      isFreeShipCoupon
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
                      <p className="text-xs font-black text-slate-900 mt-0.5">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
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
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.product.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="h-6 w-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item.product.id));
                        onToast(`Removed "${item.product.title}"`);
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
                      onClick={() => dispatch(removeCoupon())}
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
                  <span>Subtotal</span>
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
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Proceed to Checkout (${grandTotal.toFixed(2)})</span>
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
        onToast("Cart cleared");
      }}
    />
  </>
  );
}

/* ───────── Memoized Product Card (Grid) ───────── */
const ProductCard = React.memo(function ProductCard({
  product,
  isLiked,
  onQuickView,
  onToast,
}: {
  product: Product;
  isLiked: boolean;
  onQuickView: (p: Product) => void;
  onToast: (msg: string) => void;
}) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    onToast(`Added "${product.title}" to cart!`);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product.id));
    onToast(isLiked ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <article className="group relative flex flex-col rounded-3xl bg-white border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-slate-200 transition-all duration-200 transform-gpu hover:-translate-y-0.5">
      {product.rating.rate >= 4.5 && (
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs pointer-events-none">
          <TrendingUp className="h-2.5 w-2.5" />
          Top Rated
        </div>
      )}

      <button
        onClick={handleWishlist}
        title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full flex items-center justify-center transition shadow-xs ${
          isLiked
            ? "bg-rose-50 text-rose-500"
            : "bg-white/95 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50"
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-rose-500" : ""}`} />
      </button>

      <div
        className="relative flex items-center justify-center h-52 overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <Image
          src={product.image[0]}
          alt={product.title}
          width={180}
          height={180}
          className="object-contain max-h-36 transition-transform duration-300 group-hover:scale-105 transform-gpu"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-semibold text-slate-800 shadow-md">
            <Eye className="h-3 w-3" />
            Quick View
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">
          {categoryLabels[product.category]}
        </span>
        <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-2 min-h-[2rem]">
          {product.title}
        </h3>
        <Stars rate={product.rating.rate} count={product.rating.count} />

        <div className="mt-auto pt-3.5 flex items-center justify-between gap-2 border-t border-slate-100">
          <span className="text-base font-black text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleWishlist}
              className={`h-8 w-8 rounded-xl flex items-center justify-center transition ${
                isLiked
                  ? "bg-rose-50 text-rose-500"
                  : "bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${isLiked ? "fill-rose-500" : ""}`}
              />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition active:scale-95 ${
                added
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-slate-900 text-white shadow-xs hover:bg-slate-800"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add
                </>
              )}
            </button>
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
}: {
  product: Product;
  isLiked: boolean;
  onQuickView: (p: Product) => void;
  onToast: (msg: string) => void;
}) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    onToast(`Added "${product.title}" to cart!`);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product.id));
    onToast(isLiked ? "Removed from wishlist" : "Added to wishlist!");
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
          <button
            onClick={handleWishlist}
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition ${
              isLiked
                ? "bg-rose-50 text-rose-500"
                : "bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "fill-rose-500" : ""}`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
              added
                ? "bg-emerald-500 text-white shadow-xs"
                : "bg-slate-900 text-white shadow-xs hover:bg-slate-800"
            }`}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
              </>
            )}
          </button>
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

  // Toast notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2200);
  }, []);

  // Redux Selectors
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlist = useSelector((state: RootState) => state.cart.wishlist);
  const orders = useSelector((state: RootState) => state.cart.orders);
  const appliedCoupon = useSelector(
    (state: RootState) => state.cart.appliedCoupon
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
      result = result.filter((p) => p.category === activeCategory);
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

  // Real e-commerce Infinite Scroll: auto-load next 20 products seamlessly when scrolling
  const isLoadingMoreRef = React.useRef(false);
  const visibleCountRef = React.useRef(visibleCount);
  visibleCountRef.current = visibleCount;
  const filteredProductsRef = React.useRef(filteredProducts);
  filteredProductsRef.current = filteredProducts;

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first &&
          first.isIntersecting &&
          !isLoadingMoreRef.current &&
          visibleCountRef.current < filteredProductsRef.current.length
        ) {
          isLoadingMoreRef.current = true;
          setIsLoadingMore(true);
          // Small delay so skeleton cards are actually visible
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + 20, filteredProductsRef.current.length)
            );
            setIsLoadingMore(false);
            isLoadingMoreRef.current = false;
          }, 600);
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

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
      {/* ─── Floating Toast Notification ─── */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] pointer-events-none transition-all animate-in fade-in-0 slide-in-from-top-4 duration-150">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-950/95 text-white px-5 py-2.5 shadow-2xl backdrop-blur-md border border-slate-800 text-xs font-semibold">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

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
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-6 min-w-[24px] rounded-full bg-indigo-600 text-[10px] font-black text-white flex items-center justify-center px-1.5 shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-[200] rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md"
              side="left"
            >
              Cart ({cartCount})
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
              <span>Cart ({cartCount})</span>
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
        {/* Radix Tabs for Category Navigation */}
        <Tabs.Root
          value={activeCategory}
          onValueChange={(val) => {
            setActiveCategory(val as Category);
            setVisibleCount(16);
          }}
          className="mb-6"
        >
          <Tabs.List className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {categories.map((cat) => (
              <Tabs.Trigger
                key={cat}
                value={cat}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-150 active:scale-95 shrink-0 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-200 data-[state=inactive]:hover:text-slate-900 focus:outline-none"
              >
                <span>{categoryIcons[cat]}</span>
                <span>{categoryLabels[cat]}</span>
                <span
                  className={`ml-1 text-[10px] rounded-full px-1.5 py-0.5 font-bold ${
                    activeCategory === cat
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/80 text-slate-500"
                  }`}
                >
                  {categoryCounts[cat] || 0}
                </span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

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
                  setVisibleCount(16);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  priceRange === pr.id
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
                setVisibleCount(16);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                onlyTopRated
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
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={wishlist.includes(product.id)}
                onQuickView={handleQuickView}
                onToast={showToast}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleProducts.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                isLiked={wishlist.includes(product.id)}
                onQuickView={handleQuickView}
                onToast={showToast}
              />
            ))}
          </div>
        )}

        {/* Skeleton cards while loading next batch */}
        {isLoadingMore && (
          <div className="mt-5">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col sm:flex-row items-center gap-4 rounded-3xl bg-white border border-slate-100 p-4 overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent z-10 pointer-events-none" />
                    <div className="h-32 w-32 shrink-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200" />
                    <div className="flex-1 w-full space-y-2.5">
                      <div className="h-3 w-20 bg-slate-200 rounded-full" />
                      <div className="h-4 w-3/4 bg-slate-200 rounded-lg" />
                      <div className="h-3 w-full bg-slate-100 rounded" />
                      <div className="h-3 w-2/3 bg-slate-100 rounded" />
                      <div className="h-8 w-28 bg-slate-200 rounded-xl mt-2" />
                    </div>
                  </div>
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
