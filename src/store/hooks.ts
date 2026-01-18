import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth selectors
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () =>
  useAppSelector((state) => state.auth.isAuthenticated);
export const useIsAdmin = () =>
  useAppSelector((state) => state.auth.user?.role === "admin");

// Cart selectors
export const useCart = () => useAppSelector((state) => state.cart);
export const useCartItems = () => useAppSelector((state) => state.cart.items);
export const useCartItemsCount = () =>
  useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );
export const useShippingInfo = () =>
  useAppSelector((state) => state.cart.shippingInfo);
