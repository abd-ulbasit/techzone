import type { Product, Cart } from "@prisma/client";
import { create } from "zustand";
interface CartItem extends Cart {
  product: Product;
}
interface CartStoreType {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
}
export const useCartStore = create<CartStoreType>((set) => ({
  cart: [],
  setCart: (cart: CartItem[]) => set({ cart }),
  addToCart: (cartItem: CartItem) =>
    set((state) => ({
      cart: [...state.cart, cartItem],
    })),
  SetCart: (cart: CartItem[]) => set({ cart }),
  removeFromCart: (productId: number) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.pid !== productId),
    })),
  clearCart: () => set({ cart: [] }),
  increaseQuantity: (productId: number) =>
    set((state) => ({
      // console.log("increaseQuantity")

      cart: state.cart.map((item) => {
        if (item.product.pid === productId) {
          console.log("item.product.pid", item.product.pid);
          return {
            ...item,
            product_quantity: item.product_quantity + 1,
          };
        }
        return item;
      }),
    })),
  decreaseQuantity: (productId: number) =>
    set((state) => ({
      cart: state.cart.map((item) => {
        if (item.product.pid === productId) {
          return {
            ...item,
            product_quantity: item.product_quantity - 1,
          };
        }
        return item;
      }),
    })),
}));
