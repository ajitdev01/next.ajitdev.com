import type { CartState } from "./cartSlice";

export const STORE_STORAGE_KEY = "ajitdev_store_state_v2";

export interface PersistedStoreState {
  items: CartState["items"];
  wishlist: CartState["wishlist"];
  orders: CartState["orders"];
  appliedCoupon: CartState["appliedCoupon"];
}

/**
 * Safely load persisted store state from localStorage.
 */
export function loadPersistedState(): PersistedStoreState | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      appliedCoupon:
        parsed.appliedCoupon && typeof parsed.appliedCoupon === "object"
          ? parsed.appliedCoupon
          : null,
    };
  } catch (err) {
    console.warn("Failed to load persisted store state:", err);
    return null;
  }
}

/**
 * Safely save store state to localStorage.
 */
export function savePersistedState(state: {
  items: CartState["items"];
  wishlist: CartState["wishlist"];
  orders: CartState["orders"];
  appliedCoupon: CartState["appliedCoupon"];
}): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedStoreState = {
      items: state.items || [],
      wishlist: state.wishlist || [],
      orders: state.orders || [],
      appliedCoupon: state.appliedCoupon || null,
    };
    localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("Failed to save store state to localStorage:", err);
  }
}
