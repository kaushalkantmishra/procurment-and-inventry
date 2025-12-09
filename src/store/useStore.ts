import { create } from "zustand";
import { apiService } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Item {
  itemId: number;
  sku: string;
  itemName: string;
  categoryId?: number;
  unitOfMeasure?: string;
  unitCost: string;
  sellingPrice: string;
  vendorCode?: string;
  reorderLevel: number;
  safetyStock: number;
  leadTimeDays: number;
  storageLocation?: string;
  batchTracking: boolean;
  isActive: boolean;
  photoPath?: string;
  expiryDate?: string;
  discountAllowed: boolean;
  discountRate: string;
}

interface PurchaseOrder {
  poId: number;
  poNumber: string;
  supplierId?: string;
  poDate: string;
  buyerId?: string;
  totalAmount: string;
  status: string;
  termsId?: string;
  lines?: any[];
}

interface StoreState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Data
  items: Item[];
  purchaseOrders: PurchaseOrder[];
  grns: any[];
  receipts: any[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  createItem: (item: Partial<Item>) => Promise<void>;
  fetchPurchaseOrders: () => Promise<void>;
  createPurchaseOrder: (po: any) => Promise<void>;
  fetchGRNs: () => Promise<void>;
  createGRN: (grn: any) => Promise<void>;
  fetchReceipts: () => Promise<void>;
  createReceipt: (receipt: any) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Theme state
  theme: "light",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      // Save to localStorage
      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {}
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
    set({ theme });
  },

  // Authentication state
  user: null,
  isAuthenticated: false,
  login: (email: string, password: string) => {
    // Dummy authentication - accept any credentials
    const dummyUser: User = {
      id: "1",
      name: "Admin User",
      email: email,
      role: "Administrator",
    };
    set({ user: dummyUser, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),

  // Sidebar state
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => {
      const newValue = !state.sidebarCollapsed;
      try {
        localStorage.setItem("sidebarCollapsed", String(newValue));
      } catch (e) {}
      return { sidebarCollapsed: newValue };
    }),

  // Data state
  items: [],
  purchaseOrders: [],
  grns: [],
  receipts: [],
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchItems: async () => {
    try {
      set({ loading: true, error: null });
      const items = await apiService.getItems();
      set({ items, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch items', loading: false });
    }
  },

  createItem: async (item) => {
    try {
      set({ loading: true, error: null });
      const newItem = await apiService.createItem(item);
      set((state) => ({ items: [...state.items, newItem], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create item', loading: false });
    }
  },

  fetchPurchaseOrders: async () => {
    try {
      set({ loading: true, error: null });
      const purchaseOrders = await apiService.getPurchaseOrders();
      set({ purchaseOrders, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch purchase orders', loading: false });
    }
  },

  createPurchaseOrder: async (po) => {
    try {
      set({ loading: true, error: null });
      const newPO = await apiService.createPurchaseOrder(po);
      set((state) => ({ purchaseOrders: [...state.purchaseOrders, newPO], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create purchase order', loading: false });
    }
  },

  fetchGRNs: async () => {
    try {
      set({ loading: true, error: null });
      const grns = await apiService.getGRNs();
      set({ grns, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch GRNs', loading: false });
    }
  },

  createGRN: async (grn) => {
    try {
      set({ loading: true, error: null });
      const newGRN = await apiService.createGRN(grn);
      set((state) => ({ grns: [...state.grns, newGRN], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create GRN', loading: false });
    }
  },

  fetchReceipts: async () => {
    try {
      set({ loading: true, error: null });
      const receipts = await apiService.getReceipts();
      set({ receipts, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch receipts', loading: false });
    }
  },

  createReceipt: async (receipt) => {
    try {
      set({ loading: true, error: null });
      const newReceipt = await apiService.createReceipt(receipt);
      set((state) => ({ receipts: [...state.receipts, newReceipt], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create receipt', loading: false });
    }
  },
}));

// Initialize from localStorage
if (typeof window !== "undefined") {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      useStore.getState().setTheme(savedTheme);
    }
    const savedSidebar = localStorage.getItem("sidebarCollapsed");
    if (savedSidebar) {
      useStore.setState({ sidebarCollapsed: savedSidebar === "true" });
    }
  } catch (e) {
    // Ignore localStorage errors
  }
}
