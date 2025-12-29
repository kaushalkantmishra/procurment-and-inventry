import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload script executing...');

const api = {
  // Auth
  auth: {
    login: (credentials: any) => ipcRenderer.invoke('auth:login', credentials),
    logout: () => ipcRenderer.invoke('auth:logout'),
    verifyToken: (token: string) => ipcRenderer.invoke('auth:verify-token', token),
  },

  // Items
  getItems: () => ipcRenderer.invoke('items:getAll'),
  createItem: (item: any) => ipcRenderer.invoke('items:create', item),
  getItemById: (id: number) => ipcRenderer.invoke('items:getById', id),

  // Purchase Orders
  getPurchaseOrders: () => ipcRenderer.invoke('po:getAll'),
  createPurchaseOrder: (po: any) => ipcRenderer.invoke('po:create', po),

  // GRN
  getGRNs: () => ipcRenderer.invoke('grn:getAll'),
  createGRN: (grn: any) => ipcRenderer.invoke('grn:create', grn),

  // Receipts
  getReceipts: () => ipcRenderer.invoke('receipts:getAll'),
  createReceipt: (receipt: any) => ipcRenderer.invoke('receipts:create', receipt),

  // Categories
  getCategories: () => ipcRenderer.invoke('categories:getAll'),
  createCategory: (category: any) => ipcRenderer.invoke('categories:create', category),

  // Units
  getUnits: () => ipcRenderer.invoke('units:getAll'),
  createUnit: (unit: any) => ipcRenderer.invoke('units:create', unit),

  // Warehouses
  getWarehouses: () => ipcRenderer.invoke('warehouses:getAll'),
  createWarehouse: (warehouse: any) => ipcRenderer.invoke('warehouses:create', warehouse),

  // Inventory
  stockIn: (data: any) => ipcRenderer.invoke('inventory:stockIn', data),
  stockOut: (data: any) => ipcRenderer.invoke('inventory:stockOut', data),
  getTransactions: () => ipcRenderer.invoke('inventory:getTransactions'),

  // Vendors
  getVendors: () => ipcRenderer.invoke('vendors:getAll'),
  createVendor: (vendor: any) => ipcRenderer.invoke('vendors:create', vendor),
};

console.log('Exposing electronAPI to main world...');
contextBridge.exposeInMainWorld('electronAPI', api);
console.log('electronAPI exposed successfully');
