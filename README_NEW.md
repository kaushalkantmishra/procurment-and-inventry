# Procurement & Inventory Management Desktop App

A production-ready Electron desktop application for managing procurement and inventory operations with clean architecture, modular backend, and secure IPC communication.

## 🏗️ Architecture

```
project-root/
├── electron/              # Electron Main Process
│   ├── main.ts           # Main process entry
│   ├── preload.ts        # Secure preload script
│   └── ipc/              # IPC handlers
│       ├── index.ts
│       ├── items.handler.ts
│       ├── po.handler.ts
│       ├── grn.handler.ts
│       ├── receipts.handler.ts
│       ├── categories.handler.ts
│       ├── units.handler.ts
│       ├── warehouses.handler.ts
│       ├── inventory.handler.ts
│       ├── vendors.handler.ts
│       └── auth.handler.ts
│
├── backend/              # Backend Logic
│   ├── index.ts         # Backend initialization
│   ├── services/        # Business logic layer
│   │   ├── item.service.ts
│   │   ├── po.service.ts
│   │   ├── grn.service.ts
│   │   ├── receipt.service.ts
│   │   ├── category.service.ts
│   │   ├── unit.service.ts
│   │   ├── warehouse.service.ts
│   │   ├── inventory.service.ts
│   │   ├── vendor.service.ts
│   │   └── auth.service.ts
│   └── src/
│       ├── db/          # Database configuration
│       │   ├── index.ts
│       │   ├── schema.ts
│       │   └── schema/
│       │       └── user.schema.ts
│       └── seed.ts      # Database seeding
│
├── src/                 # Renderer Process (React UI)
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.ts      # IPC communication wrapper
│   └── store/
│
├── config/              # Configuration
│   └── env.ts
│
├── package.json         # Unified dependencies
├── tsconfig.json        # Renderer TypeScript config
├── tsconfig.electron.json  # Electron + Backend config
├── vite.config.ts       # Vite configuration
└── .env                 # Environment variables
```

## ✨ Features

### Security Best Practices
- ✅ `nodeIntegration: false` - No Node.js in renderer
- ✅ `contextIsolation: true` - Isolated contexts
- ✅ Secure IPC via `contextBridge`
- ✅ Whitelisted API exposure only

### Architecture Benefits
- ✅ Clean separation of concerns
- ✅ Modular service layer
- ✅ Type-safe IPC communication
- ✅ Drizzle ORM with PostgreSQL
- ✅ Transaction support
- ✅ Error handling

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   
   Update `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/procurement_db
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

3. **Setup database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

   This will:
   - Start Vite dev server (port 5173)
   - Launch Electron app
   - Enable hot reload

## 📜 Available Scripts

### Development
```bash
npm run dev              # Start Vite + Electron
npm run dev:vite         # Start Vite only
npm run dev:electron     # Start Electron only
```

### Database
```bash
npm run db:push          # Push schema to database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:seed          # Seed initial data
```

### Build
```bash
npm run build            # Build renderer + electron
npm run build:renderer   # Build React app
npm run build:electron   # Build Electron main
npm run package          # Package for distribution
```

## 🔌 IPC Communication

### Renderer → Main Process

The renderer uses `window.api` to communicate with the main process:

```typescript
// In React components
import { apiService } from './services/api';

// Get all items
const items = await apiService.getItems();

// Create item
const newItem = await apiService.createItem({
  sku: 'ITEM001',
  itemName: 'Product Name',
  categoryId: 1,
  // ...
});
```

### Available API Methods

**Items**
- `getItems()` - Get all items
- `createItem(item)` - Create new item
- `getItemById(id)` - Get item by ID

**Purchase Orders**
- `getPurchaseOrders()` - Get all POs
- `createPurchaseOrder(po)` - Create new PO

**GRN**
- `getGRNs()` - Get all GRNs
- `createGRN(grn)` - Create new GRN

**Receipts**
- `getReceipts()` - Get all receipts
- `createReceipt(receipt)` - Create new receipt

**Categories**
- `getCategories()` - Get all categories
- `createCategory(category)` - Create new category

**Units**
- `getUnits()` - Get all units
- `createUnit(unit)` - Create new unit

**Warehouses**
- `getWarehouses()` - Get all warehouses
- `createWarehouse(warehouse)` - Create new warehouse

**Inventory**
- `stockIn(data)` - Stock in items
- `stockOut(data)` - Stock out items
- `getTransactions()` - Get all transactions

**Vendors**
- `getVendors()` - Get all vendors
- `createVendor(vendor)` - Create new vendor

**Auth**
- `login(credentials)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `getCurrentUser()` - Get current user

## 🗄️ Database Schema

The application uses Drizzle ORM with PostgreSQL. Schema files are located in:
- `backend/src/db/schema.ts` - Main schema
- `backend/src/db/schema/user.schema.ts` - User schema

Key tables:
- `tbl_items` - Product/Item master
- `tbl_categories` - Category master
- `tbl_units` - Unit of measure
- `tbl_warehouses` - Warehouse master
- `tbl_purchase_orders` - Purchase orders
- `tbl_po_lines` - PO line items
- `tbl_grn_headers` - Goods receipt notes
- `tbl_receipt_headers` - Sales receipts
- `tbl_inventory_transactions` - Inventory movements
- `tbl_vendors` - Vendor master
- `tbl_users` - User accounts

## 🔒 Security

### Electron Security
- Context isolation enabled
- Node integration disabled in renderer
- Preload script with whitelisted APIs
- No direct Node.js access from UI

### Authentication
- JWT-based authentication
- Bcrypt password hashing
- Role-based access (admin/employee)
- Secure token storage

## 🛠️ Tech Stack

### Frontend (Renderer)
- React 18 with TypeScript
- Vite for fast builds
- Tailwind CSS for styling
- Zustand for state management
- React Router for navigation

### Backend
- Node.js with TypeScript
- Drizzle ORM
- PostgreSQL database
- JWT authentication
- Bcrypt encryption

### Desktop
- Electron 33
- IPC communication
- Secure preload scripts
- Context isolation

## 📦 Building for Production

### Build the application
```bash
npm run build
```

### Package for distribution
```bash
npm run package
```

This will create installers in the `release/` directory for:
- Windows (NSIS installer)
- macOS (DMG)
- Linux (AppImage)

## 🔧 Troubleshooting

### Database connection issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Electron not starting
- Clear dist-electron folder
- Rebuild: `npm run build:electron`
- Check for TypeScript errors

### IPC communication errors
- Verify preload script is loaded
- Check window.api is available
- Review IPC handler registration

## 📝 Development Notes

### Adding New Features

1. **Create Service** (backend/services/)
   ```typescript
   export class MyService {
     async getData() {
       return await db.select().from(myTable);
     }
   }
   ```

2. **Create IPC Handler** (electron/ipc/)
   ```typescript
   import { ipcMain } from 'electron';
   import { MyService } from '../../backend/services/my.service';
   
   const myService = new MyService();
   
   ipcMain.handle('my:getData', async () => {
     return await myService.getData();
   });
   ```

3. **Expose in Preload** (electron/preload.ts)
   ```typescript
   const api = {
     // ...
     getData: () => ipcRenderer.invoke('my:getData'),
   };
   ```

4. **Use in Renderer** (src/)
   ```typescript
   const data = await window.api.getData();
   ```

## 📄 License

MIT License

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

**Built with ❤️ using Electron, React, and TypeScript**
