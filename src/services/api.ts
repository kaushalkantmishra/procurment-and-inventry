declare global {
  interface Window {
    api: {
      getItems: () => Promise<any>;
      createItem: (item: any) => Promise<any>;
      getItemById: (id: number) => Promise<any>;
      getPurchaseOrders: () => Promise<any>;
      createPurchaseOrder: (po: any) => Promise<any>;
      getGRNs: () => Promise<any>;
      createGRN: (grn: any) => Promise<any>;
      getReceipts: () => Promise<any>;
      createReceipt: (receipt: any) => Promise<any>;
      getCategories: () => Promise<any>;
      createCategory: (category: any) => Promise<any>;
      getUnits: () => Promise<any>;
      createUnit: (unit: any) => Promise<any>;
      getWarehouses: () => Promise<any>;
      createWarehouse: (warehouse: any) => Promise<any>;
      stockIn: (data: any) => Promise<any>;
      stockOut: (data: any) => Promise<any>;
      getTransactions: () => Promise<any>;
      getVendors: () => Promise<any>;
      createVendor: (vendor: any) => Promise<any>;
      login: (credentials: any) => Promise<any>;
      register: (userData: any) => Promise<any>;
      logout: () => Promise<any>;
      getCurrentUser: () => Promise<any>;
    };
  }
}

class ApiService {
  async getItems() {
    return window.api.getItems();
  }

  async createItem(item: any) {
    return window.api.createItem(item);
  }

  async getItemById(id: number) {
    return window.api.getItemById(id);
  }

  async getPurchaseOrders() {
    return window.api.getPurchaseOrders();
  }

  async createPurchaseOrder(po: any) {
    return window.api.createPurchaseOrder(po);
  }

  async getGRNs() {
    return window.api.getGRNs();
  }

  async createGRN(grn: any) {
    return window.api.createGRN(grn);
  }

  async getReceipts() {
    return window.api.getReceipts();
  }

  async createReceipt(receipt: any) {
    return window.api.createReceipt(receipt);
  }

  async getCategories() {
    return window.api.getCategories();
  }

  async createCategory(category: any) {
    return window.api.createCategory(category);
  }

  async getUnits() {
    return window.api.getUnits();
  }

  async createUnit(unit: any) {
    return window.api.createUnit(unit);
  }

  async getWarehouses() {
    return window.api.getWarehouses();
  }

  async createWarehouse(warehouse: any) {
    return window.api.createWarehouse(warehouse);
  }

  async stockIn(data: any) {
    return window.api.stockIn(data);
  }

  async stockOut(data: any) {
    return window.api.stockOut(data);
  }

  async getTransactions() {
    return window.api.getTransactions();
  }

  async getVendors() {
    return window.api.getVendors();
  }

  async createVendor(vendor: any) {
    return window.api.createVendor(vendor);
  }

  async login(credentials: any) {
    return window.api.login(credentials);
  }

  async register(userData: any) {
    return window.api.register(userData);
  }

  async logout() {
    return window.api.logout();
  }

  async getCurrentUser() {
    return window.api.getCurrentUser();
  }

  async healthCheck() {
    return { status: 'ok', timestamp: new Date() };
  }
}

export const apiService = new ApiService();
