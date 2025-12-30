// Module service for fetching user's available modules

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  isAvailable: boolean;
  comingSoon?: boolean;
}

// All ERP modules
const ALL_MODULES: Module[] = [
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Purchase orders, vendor management, quote requests, and procurement tracking',
    icon: 'ShoppingCart',
    route: '/procurement',
    isAvailable: true
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Stock levels, item locations, movements, and inventory optimization',
    icon: 'Package',
    route: '/inventory',
    isAvailable: true
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Application configuration and user management',
    icon: 'Settings',
    route: '/settings',
    isAvailable: true
  },
  {
    id: 'analytics',
    name: 'Reporting and Analytics',
    description: 'Global dashboards, reports, KPIs, and business intelligence insights',
    icon: 'BarChart',
    route: '/analytics',
    isAvailable: false,
    comingSoon: true
  },
  {
    id: 'financial',
    name: 'Financial Management',
    description: 'Accounts payable, receivable, general ledger, budgeting, and financial reporting',
    icon: 'DollarSign',
    route: '/financial',
    isAvailable: false,
    comingSoon: true
  },
  {
    id: 'hr',
    name: 'Human Resources (HR) Management',
    description: 'Recruitment, payroll, benefits, time tracking, and performance management',
    icon: 'Users',
    route: '/hr',
    isAvailable: false,
    comingSoon: true
  },
  {
    id: 'scm',
    name: 'Supply Chain Management (SCM)',
    description: 'Plan, execute, and monitor the flow of goods and services from suppliers to customers',
    icon: 'Truck',
    route: '/scm',
    isAvailable: false,
    comingSoon: true
  },
  {
    id: 'crm',
    name: 'Customer Relationship Management (CRM)',
    description: 'Lead tracking, sales automation, marketing campaigns, and customer service',
    icon: 'UserCheck',
    route: '/crm',
    isAvailable: false,
    comingSoon: true
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Production planning, scheduling, quality control, BOM, and work-in-progress tracking',
    icon: 'Factory',
    route: '/manufacturing',
    isAvailable: false,
    comingSoon: true
  },
  {
    id: 'sales',
    name: 'Sales and Marketing',
    description: 'Sales process, quotes, orders, customer invoices, and marketing campaigns',
    icon: 'TrendingUp',
    route: '/sales',
    isAvailable: false,
    comingSoon: true
  },
  {
    id: 'projects',
    name: 'Project Management',
    description: 'Plan, schedule, budget, and track project progress, tasks, and resources',
    icon: 'Briefcase',
    route: '/projects',
    isAvailable: false,
    comingSoon: true
  }
];

class ModuleService {
  async getUserModules(userRole: 'admin' | 'employee'): Promise<Module[]> {
    if (userRole === 'admin') {
      return ALL_MODULES.filter(module => module.id !== 'settings');
    } else {
      // Employee gets limited access - procurement and inventory, and analytics
      return ALL_MODULES.filter(module => 
        ['procurement', 'inventory', 'analytics'].includes(module.id)
      );
    }
  }

  async getAllModules(): Promise<Module[]> {
    return ALL_MODULES;
  }
}

export const moduleService = new ModuleService();