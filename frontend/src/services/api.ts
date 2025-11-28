const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Items API
  async getItems() {
    return this.request('/items');
  }

  async createItem(item: any) {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async getItemById(id: number) {
    return this.request(`/items/${id}`);
  }

  // Purchase Orders API
  async getPurchaseOrders() {
    return this.request('/po');
  }

  async createPurchaseOrder(po: any) {
    return this.request('/po', {
      method: 'POST',
      body: JSON.stringify(po),
    });
  }

  // GRN API
  async getGRNs() {
    return this.request('/grn');
  }

  async createGRN(grn: any) {
    return this.request('/grn', {
      method: 'POST',
      body: JSON.stringify(grn),
    });
  }

  // Receipts API
  async getReceipts() {
    return this.request('/receipts');
  }

  async createReceipt(receipt: any) {
    return this.request('/receipts', {
      method: 'POST',
      body: JSON.stringify(receipt),
    });
  }

  // Categories API
  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(category: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  // Units API
  async getUnits() {
    return this.request('/units');
  }

  async createUnit(unit: any) {
    return this.request('/units', {
      method: 'POST',
      body: JSON.stringify(unit),
    });
  }

  // Warehouses API
  async getWarehouses() {
    return this.request('/warehouses');
  }

  async createWarehouse(warehouse: any) {
    return this.request('/warehouses', {
      method: 'POST',
      body: JSON.stringify(warehouse),
    });
  }

  // Inventory API
  async stockIn(data: any) {
    return this.request('/inventory/stock-in', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async stockOut(data: any) {
    return this.request('/inventory/stock-out', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTransactions() {
    return this.request('/inventory/transactions');
  }

  // Vendors API
  async getVendors() {
    return this.request('/vendors');
  }

  async createVendor(vendor: any) {
    return this.request('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendor),
    });
  }

  // Health check
  async healthCheck() {
    const url = 'http://localhost:3000/health';
    const response = await fetch(url);
    return await response.json();
  }
}

export const apiService = new ApiService();