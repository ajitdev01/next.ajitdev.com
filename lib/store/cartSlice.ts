import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/lib/store-data";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  address: string;
  city: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  customer: OrderCustomer;
  status: "Confirmed" | "Processing" | "Delivered";
}

export interface CartState {
  items: CartItem[];
  wishlist: number[]; // product IDs
  orders: Order[];
  appliedCoupon: AppliedCoupon | null;
  isHydrated: boolean;
}

const initialState: CartState = {
  items: [],
  wishlist: [],
  orders: [],
  appliedCoupon: null,
  isHydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<Product | { product: Product; quantity?: number }>
    ) {
      const product =
        "id" in action.payload ? action.payload : action.payload.product;
      const addQty =
        "quantity" in action.payload && action.payload.quantity
          ? action.payload.quantity
          : 1;

      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        existing.quantity += addQty;
      } else {
        state.items.push({ product, quantity: addQty });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) {
      const item = state.items.find((i) => i.product.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.product.id !== action.payload.id
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
    toggleWishlist(state, action: PayloadAction<number>) {
      const id = action.payload;
      const index = state.wishlist.indexOf(id);
      if (index >= 0) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(id);
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.wishlist = state.wishlist.filter((id) => id !== action.payload);
    },
    moveToCartFromWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload;
      // Remove from wishlist
      state.wishlist = state.wishlist.filter((id) => id !== product.id);
      // Add to cart
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
    },
    addAllWishlistToCart(state, action: PayloadAction<Product[]>) {
      action.payload.forEach((prod) => {
        const existing = state.items.find((item) => item.product.id === prod.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          state.items.push({ product: prod, quantity: 1 });
        }
      });
      state.wishlist = [];
    },
    applyCoupon(state, action: PayloadAction<AppliedCoupon>) {
      state.appliedCoupon = action.payload;
    },
    removeCoupon(state) {
      state.appliedCoupon = null;
    },
    placeOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
      state.items = [];
      state.appliedCoupon = null;
    },
    clearOrders(state) {
      state.orders = [];
    },
    rehydrate(state, action: PayloadAction<Partial<CartState>>) {
      if (action.payload.items) state.items = action.payload.items;
      if (action.payload.wishlist) state.wishlist = action.payload.wishlist;
      if (action.payload.orders) state.orders = action.payload.orders;
      if (action.payload.appliedCoupon !== undefined) {
        state.appliedCoupon = action.payload.appliedCoupon;
      }
      state.isHydrated = true;
    },
    setHydrated(state) {
      state.isHydrated = true;
    },
  },
});

export const {
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
  rehydrate,
  setHydrated,
} = cartSlice.actions;

export default cartSlice.reducer;
