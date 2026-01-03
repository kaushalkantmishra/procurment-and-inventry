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

# 2. Setup backend
cd backend
npm install
cp .env.sample .env
# Edit .env with your database credentials

# 3. Setup database
npm run db:push
npm run db:seed

# 4. Start backend server
npm run dev

# 5. Start frontend (in new terminal)
cd ..
npm run dev
```

### Development with All Services
```bash
# Start backend, frontend, and electron together
npm run dev:full
```

## 📁 Project Structure

```
├── backend/                       # Backend API Server
│   ├── src/
│   │   ├── core/                  # Core functionality
│   │   ├── db/                    # Database configuration
│   │   ├── modules/               # ERP Modules
│   │   └── routes/                # API Routes
│   ├── services/                  # Business logic services
│   ├── server.ts                  # Express server
│   └── package.json               # Backend dependencies
├── electron/                      # Electron main process
│   └── main.ts                    # Simplified main process
└── src/                           # React frontend
    ├── components/                # Reusable UI components
    ├── pages/                     # Application pages
    ├── services/                  # HTTP API services
    └── store/                     # State management
```

## 🏗️ Architecture

### Separated Backend Architecture
- **Backend Server**: Standalone Express.js API server (port 3001)
- **Frontend**: React app served by Vite (port 5173)
- **Electron App**: Desktop wrapper that loads the React frontend
- **Communication**: HTTP REST API calls between frontend and backend
- **Database**: Direct PostgreSQL connection from backend server

### Modular ERP Design
- **Core Layer**: Shared services (auth, RBAC, audit, events)
- **Module Layer**: Business logic organized by domain
- **API Layer**: RESTful endpoints instead of IPC handlers
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

### Development
```bash
# Backend only
cd backend
npm run dev

# Frontend only
npm run dev:vite

# Electron only
npm run dev:electron

# All services together
npm run dev:full
```

### Building for Production
```bash
# Build backend
npm run build:backend

# Build frontend
npm run build

# Build Electron app
npm run electron:build
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