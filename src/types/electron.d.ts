declare global {
  interface Window {
    electronAPI: {
      auth: {
        login: (credentials: any) => Promise<any>;
        logout: () => Promise<void>;
        verifyToken: (token: string) => Promise<any>;
      };
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
    };
  }
}

export {};