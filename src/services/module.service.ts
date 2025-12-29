// Module service for fetching user's available modules

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  isActive: boolean;
}

// Static modules for now (later will come from database)
const AVAILABLE_MODULES: Module[] = [
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Purchase orders, requests, and supplier management',
    icon: 'ShoppingCart',
    route: '/procurement',
    isActive: true
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Items, stock management, and transactions',
    icon: 'Package',
    route: '/inventory',
    isActive: true
  },
  {
    id: 'masters',
    name: 'Masters',
    description: 'Categories, units, warehouses, and vendors',
    icon: 'Settings',
    route: '/masters',
    isActive: true
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Analytics and reporting dashboard',
    icon: 'BarChart',
    route: '/reports',
    isActive: true
  }
];

class ModuleService {
  async getUserModules(userRole: 'admin' | 'employee'): Promise<Module[]> {
    // For now, return based on role
    // Later this will fetch from database based on user permissions
    if (userRole === 'admin') {
      return AVAILABLE_MODULES;
    } else {
      // Employee gets limited access
      return AVAILABLE_MODULES.filter(module => 
        ['inventory', 'reports'].includes(module.id)
      );
    }
  }

  async getAllModules(): Promise<Module[]> {
    return AVAILABLE_MODULES;
  }
}

export const moduleService = new ModuleService();