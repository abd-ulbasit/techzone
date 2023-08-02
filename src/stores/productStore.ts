import type { Product } from "@prisma/client";
import { create } from "zustand";
interface ProductStoreType {
  products: Product[];
  setProducts: (products: Product[]) => void;
}
const useProductStore = create<ProductStoreType>((set) => ({
  products: [],
  setProducts: (products: Product[]) => set({ products }),
}));
export default useProductStore;
