import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const message = error.response?.data?.error || error.message || 'Request failed';
        throw new Error(message);
      }
    );
  }

  private async request(endpoint: string, config: AxiosRequestConfig = {}): Promise<any> {
    return this.client.request({ url: endpoint, ...config });
  }

  // Items API
  async getItems() {
    return this.request('/items');
  }

  async createItem(item: any) {
    return this.request('/items', {
      method: 'POST',
      data: item,
    });
  }

  async getItemById(id: number) {
    return this.request(`/items/${id}`);
  }

  async updateItem(id: number, item: any) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      data: item,
    });
  }

  async deleteItem(id: number) {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories() {
    return this.request('/categories/');
  }

  async createCategory(category: any) {
    return this.request('/categories', {
      method: 'POST',
      data: category,
    });
  }

  async getCategoryById(id: number) {
    return this.request(`/categories/${id}`);
  }

  async updateCategory(id: number, category: any) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      data: category,
    });
  }

  async deleteCategory(id: number) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Units API
  async getUnits() {
    return this.request('/units');
  }

  async createUnit(unit: any) {
    return this.request('/units', {
      method: 'POST',
      data: unit,
    });
  }

  async getUnitById(id: number) {
    return this.request(`/units/${id}`);
  }

  async updateUnit(id: number, unit: any) {
    return this.request(`/units/${id}`, {
      method: 'PUT',
      data: unit,
    });
  }

  async deleteUnit(id: number) {
    return this.request(`/units/${id}`, {
      method: 'DELETE',
    });
  }

  // Warehouses API
  async getWarehouses() {
    return this.request('/warehouses');
  }

  async createWarehouse(warehouse: any) {
    return this.request('/warehouses', {
      method: 'POST',
      data: warehouse,
    });
  }

  async getWarehouseById(id: number) {
    return this.request(`/warehouses/${id}`);
  }

  async updateWarehouse(id: number, warehouse: any) {
    return this.request(`/warehouses/${id}`, {
      method: 'PUT',
      data: warehouse,
    });
  }

  async deleteWarehouse(id: number) {
    return this.request(`/warehouses/${id}`, {
      method: 'DELETE',
    });
  }

  // Vendors API
  async getVendors() {
    return this.request('/vendors');
  }

  async createVendor(vendor: any) {
    return this.request('/vendors', {
      method: 'POST',
      data: vendor,
    });
  }

  async getVendorById(id: number) {
    return this.request(`/vendors/${id}`);
  }

  async updateVendor(id: number, vendor: any) {
    return this.request(`/vendors/${id}`, {
      method: 'PUT',
      data: vendor,
    });
  }

  async deleteVendor(id: number) {
    return this.request(`/vendors/${id}`, {
      method: 'DELETE',
    });
  }

  // Modules API
  async getModules() {
    return this.request('/modules');
  }

  async createModule(module: any) {
    return this.request('/modules', {
      method: 'POST',
      data: module,
    });
  }

  async getModuleById(id: number) {
    return this.request(`/modules/${id}`);
  }

  async updateModule(id: number, module: any) {
    return this.request(`/modules/${id}`, {
      method: 'PUT',
      data: module,
    });
  }

  async deleteModule(id: number) {
    return this.request(`/modules/${id}`, {
      method: 'DELETE',
    });
  }

  // Purchase Orders API
  async getPurchaseOrders() {
    return this.request('/purchase-orders');
  }

  async createPurchaseOrder(po: any) {
    return this.request('/purchase-orders', {
      method: 'POST',
      data: po,
    });
  }

  async getPurchaseOrderById(id: number) {
    return this.request(`/purchase-orders/${id}`);
  }

  async updatePurchaseOrder(id: number, po: any) {
    return this.request(`/purchase-orders/${id}`, {
      method: 'PUT',
      data: po,
    });
  }

  async deletePurchaseOrder(id: number) {
    return this.request(`/purchase-orders/${id}`, {
      method: 'DELETE',
    });
  }

  // PO Lines API
  async getPOLines() {
    return this.request('/po-lines');
  }

  async getPOLinesByPOId(poId: number) {
    return this.request(`/po-lines/po/${poId}`);
  }

  async createPOLine(line: any) {
    return this.request('/po-lines', {
      method: 'POST',
      data: line,
    });
  }

  // GRN Headers API
  async getGRNHeaders() {
    return this.request('/grn-headers');
  }

  async createGRNHeader(grn: any) {
    return this.request('/grn-headers', {
      method: 'POST',
      data: grn,
    });
  }

  // GRN Details API
  async getGRNDetails() {
    return this.request('/grn-details');
  }

  async getGRNDetailsByGRNId(grnId: number) {
    return this.request(`/grn-details/grn/${grnId}`);
  }

  async createGRNDetail(detail: any) {
    return this.request('/grn-details', {
      method: 'POST',
      data: detail,
    });
  }

  // Purchase Requests API
  async getPurchaseRequests() {
    return this.request('/purchase-requests');
  }

  async createPurchaseRequest(pr: any) {
    return this.request('/purchase-requests', {
      method: 'POST',
      data: pr,
    });
  }

  async getGRNs() {
    return this.request('/grn');
  }

  async createGRN(grn: any) {
    return this.request('/grn', {
      method: 'POST',
      data: grn,
    });
  }

  async getReceipts() {
    return this.request('/receipts');
  }

  async createReceipt(receipt: any) {
    return this.request('/receipts', {
      method: 'POST',
      data: receipt,
    });
  }

  async stockIn(data: any) {
    return this.request('/inventory/stock-in', {
      method: 'POST',
      data: data,
    });
  }

  async stockOut(data: any) {
    return this.request('/inventory/stock-out', {
      method: 'POST',
      data: data,
    });
  }

  async getTransactions() {
    return this.request('/inventory/transactions');
  }

  // Auth API
  async login(credentials: any) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      data: credentials,
    });
    if (result?.token) {
      localStorage.setItem('token', result.token);
    }
    return result;
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      data: userData,
    });
  }

  async logout() {
    localStorage.removeItem('token');
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async healthCheck() {
    return axios.get(`${API_BASE_URL.replace('/api', '')}/health`).then(r => r.data);
  }
}

export const apiService = new ApiService();
