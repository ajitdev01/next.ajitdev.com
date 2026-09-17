"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/lib/store";
import { rehydrate, setHydrated } from "./cartSlice";
import { loadPersistedState, STORE_STORAGE_KEY } from "./persistence";

function StoreHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Initial hydration from localStorage
    const saved = loadPersistedState();
    if (saved) {
      dispatch(rehydrate(saved));
    } else {
      dispatch(setHydrated());
    }

    // 2. Cross-tab sync listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORE_STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          dispatch(
            rehydrate({
              items: Array.isArray(updated.items) ? updated.items : [],
              wishlist: Array.isArray(updated.wishlist) ? updated.wishlist : [],
              orders: Array.isArray(updated.orders) ? updated.orders : [],
              appliedCoupon: updated.appliedCoupon || null,
            })
          );
        } catch {
          // Ignore parse errors from concurrent writes
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <StoreHydrator>{children}</StoreHydrator>
    </Provider>
  );
}
