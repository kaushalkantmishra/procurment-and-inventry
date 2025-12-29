# Procurement & Inventory Management Desktop App

A modular Electron-based ERP desktop application for managing procurement and inventory operations with PostgreSQL and Drizzle ORM.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Setup & Run
```bash
# 1. Clone and install
git clone <repository-url>
cd procurement-and-inventory-management-desktop-app
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup database
cd backend
npx drizzle-kit push
npm run seed

# 4. Start application
cd ..
npm run dev
```

## 📁 Project Structure

```
├── .env                           # Environment configuration
├── config/env.ts                  # Environment loader
├── backend/src/
│   ├── core/                      # Core functionality
│   │   ├── auth/                  # Authentication
│   │   ├── rbac/                  # Role-based access control
│   │   ├── audit/                 # Audit logging
│   │   └── events/                # Event bus system
│   ├── db/schema.ts               # Main schema (imports all modules)
│   └── modules/                   # ERP Modules
│       ├── masters/               # Master data (users, categories, units, warehouses, vendors)
│       ├── inventory/             # Items, transactions, receipts, payments
│       ├── procurement/           # Purchase orders, requests, GRN
│       ├── finance/               # Future: Finance module
│       ├── hrms/                  # Future: HR module
│       └── sales/                 # Future: Sales module
├── electron/                      # Electron main process
│   ├── main.ts                    # Main process
│   ├── preload.ts                 # Preload script
│   └── ipc/                       # IPC handlers (organized by module)
└── src/                           # React frontend
    ├── components/                # Reusable UI components
    ├── pages/                     # Application pages
    ├── services/                  # API services
    └── store/                     # State management
```

## 🏗️ Architecture

### Electron Desktop Architecture
- **Main Process**: Database operations, IPC handling
- **Renderer Process**: React UI
- **IPC Communication**: Module-based handlers
- **No HTTP Server**: Direct database access from main process

### Modular ERP Design
- **Core Layer**: Shared services (auth, RBAC, audit, events)
- **Module Layer**: Business logic organized by domain
- **Handler Pattern**: IPC handlers instead of REST controllers
- **Event-Driven**: Inter-module communication via event bus

## 🗄️ Database Schema

### Masters Module
- `tbl_users` - User accounts and roles
- `tbl_categories` - Product categories
- `tbl_units` - Units of measure
- `tbl_warehouses` - Warehouse locations
- `tbl_vendors` - Vendor information

### Inventory Module
- `tbl_items` - Product catalog
- `tbl_inventory_transactions` - Stock movements
- `tbl_receipt_headers` - Sales receipts
- `tbl_receipt_lines` - Receipt line items
- `tbl_payments` - Payment records

### Procurement Module
- `tbl_purchase_requests` - Purchase requests
- `tbl_purchase_orders` - Purchase orders
- `tbl_po_lines` - PO line items
- `tbl_po_distributions` - PO distributions
- `tbl_grn_headers` - Goods receipt notes
- `tbl_grn_details` - GRN details

## 🔧 Development

### Database Operations
```bash
cd backend
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit push        # Push to database
npm run seed               # Seed initial data
```

### Running in Development
```bash
npm run dev                # Start both frontend and Electron
```

### Building for Production
```bash
npm run build             # Build React app
npm run electron:build    # Build Electron app
```

## 🎯 Features

### Current Features
- **Items Management**: Product catalog with categories and units
- **Purchase Orders**: Create and track purchase orders
- **Goods Receipt Notes**: Record incoming inventory
- **Receipts**: Track sales and outgoing inventory
- **Real-time Inventory**: Monitor stock levels and transactions
- **User Management**: Role-based access control

### Future Modules (Ready for Implementation)
- **Finance**: Accounting, invoicing, payments
- **HRMS**: Employee management, payroll, attendance
- **Sales**: Customer management, orders, quotations
- **Manufacturing**: Work orders, BOM, production planning

## 🔐 Environment Configuration

Create `.env` file in root:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/procurement_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## 🚀 Adding New Modules

### 1. Create Module Structure
```bash
mkdir backend/src/modules/[module-name]
mkdir backend/src/modules/[module-name]/schemas
mkdir backend/src/modules/[module-name]/services
mkdir backend/src/modules/[module-name]/handlers
```

### 2. Create Schema
```typescript
// backend/src/modules/[module-name]/schemas/[module].schema.ts
export const tblModuleTable = pgTable("tbl_module_table", {
  // Define your table structure
});
```

### 3. Create Handlers
```typescript
// backend/src/modules/[module-name]/handlers/index.ts
export class ModuleHandler {
  static async getAll() {
    // Business logic
    eventBus.emitEvent({
      type: 'MODULE_ACTION',
      source: 'MODULE',
      timestamp: new Date(),
      data: {}
    });
  }
}
```

### 4. Create IPC Handlers
```typescript
// electron/ipc/[module-name]/[entity].handler.ts
import { ModuleHandler } from '../../backend/src/modules/[module-name]/handlers';

export const moduleHandler = {
  getAll: () => ModuleHandler.getAll(),
  // Other methods
};
```

### 5. Update Main Schema
```typescript
// backend/src/db/schema.ts
export * from "../modules/[module-name]/schemas/[module].schema";
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Architecture**: Modular handlers (no HTTP server)

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand

### Desktop
- **Framework**: Electron
- **IPC**: Type-safe communication
- **Process Separation**: Main/Renderer isolation

## 📝 Scripts

```bash
npm run dev              # Start development
npm run build            # Build for production
npm run electron:dev     # Electron development
npm run electron:build   # Build Electron app
```

## 🤝 Contributing

1. Follow the modular architecture
2. Use handlers instead of controllers
3. Emit events for inter-module communication
4. Maintain type safety throughout
5. Test both IPC and business logic

## 📄 License

MIT License