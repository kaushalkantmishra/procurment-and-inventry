import { create } from "zustand";
import { apiService } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Item {
  id: number;
  sku: string;
  item_name: string;
  category_id?: number;
  unit_of_measure?: string;
  unit_cost: string;
  selling_price: string;
  vendor_code?: string;
  reorder_level: number;
  safety_stock: number;
  lead_time_days: number;
  storage_location?: string;
  batch_tracking: boolean;
  is_active: boolean;
  photo_path?: string;
  expiry_date?: string;
  discount_allowed: boolean;
  discount_rate: string;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_deleted: boolean;
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id?: string;
  po_date: string;
  buyer_id?: string;
  total_amount: string;
  status: string;
  terms_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_deleted: boolean;
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
  purchaseRequests: any[];
  grns: any[];
  vendorInvoices: any[];
  threeWayMatching: any[];
  receipts: any[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  createItem: (item: Partial<Item>) => Promise<void>;
  fetchPurchaseOrders: () => Promise<void>;
  createPurchaseOrder: (po: any) => Promise<void>;
  fetchPurchaseRequests: () => Promise<void>;
  createPurchaseRequest: (pr: any) => Promise<void>;
  fetchGRNs: () => Promise<void>;
  createGRN: (grn: any) => Promise<void>;
  fetchVendorInvoices: () => Promise<void>;
  createVendorInvoice: (invoice: any) => Promise<void>;
  fetchThreeWayMatching: () => Promise<void>;
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
  purchaseRequests: [],
  grns: [],
  vendorInvoices: [],
  threeWayMatching: [],
  receipts: [],
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchItems: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.getItems();
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      set({ items, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch items', loading: false, items: [] });
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
      const response = await apiService.getPurchaseOrders();
      const purchaseOrders = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      set({ purchaseOrders, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch purchase orders', loading: false, purchaseOrders: [] });
    }
  },

  createPurchaseOrder: async (po) => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.createPurchaseOrder(po);
      const newPO = response.data || response;
      set((state) => ({ purchaseOrders: [...state.purchaseOrders, newPO], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create purchase order', loading: false });
    }
  },

  fetchPurchaseRequests: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.getPurchaseRequests();
      const purchaseRequests = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      set({ purchaseRequests, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch purchase requests', loading: false, purchaseRequests: [] });
    }
  },

  createPurchaseRequest: async (pr) => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.createPurchaseRequest(pr);
      const newPR = response.data || response;
      set((state) => ({ purchaseRequests: [...state.purchaseRequests, newPR], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create purchase request', loading: false });
    }
  },

  fetchVendorInvoices: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.getVendorInvoices();
      const vendorInvoices = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      set({ vendorInvoices, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch vendor invoices', loading: false, vendorInvoices: [] });
    }
  },

  createVendorInvoice: async (invoice) => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.createVendorInvoice(invoice);
      const newInvoice = response.data || response;
      set((state) => ({ vendorInvoices: [...state.vendorInvoices, newInvoice], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create vendor invoice', loading: false });
    }
  },

  fetchThreeWayMatching: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.getThreeWayMatching();
      const threeWayMatching = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      set({ threeWayMatching, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch three way matching', loading: false, threeWayMatching: [] });
    }
  },

  fetchGRNs: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.getGRNs();
      const grns = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      set({ grns, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch GRNs', loading: false, grns: [] });
    }
  },

  createGRN: async (grn) => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.createGRN(grn);
      const newGRN = response.data || response;
      set((state) => ({ grns: [...state.grns, newGRN], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create GRN', loading: false });
    }
  },

  fetchReceipts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.getReceipts();
      const receipts = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      set({ receipts, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch receipts', loading: false, receipts: [] });
    }
  },

  createReceipt: async (receipt) => {
    try {
      set({ loading: true, error: null });
      const response = await apiService.createReceipt(receipt);
      const newReceipt = response.data || response;
      set((state) => ({ receipts: [...state.receipts, newReceipt], loading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create receipt', loading: false });
    }
  },
}));

// Theme hook for compatibility
export const useTheme = () => {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const setTheme = useStore((state) => state.setTheme);
  
  return { theme, toggleTheme, setTheme };
};

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
