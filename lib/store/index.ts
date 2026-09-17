import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { CartState } from "./cartSlice";
import { savePersistedState } from "./persistence";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Automatically persist cart state changes to localStorage once hydrated
let prevCartState: CartState | null = null;
store.subscribe(() => {
  const state = store.getState();
  if (state.cart.isHydrated && state.cart !== prevCartState) {
    prevCartState = state.cart;
    savePersistedState(state.cart);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
