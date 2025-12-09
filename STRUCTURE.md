# Complete Project Structure

## 📁 Final Folder Structure

```
procurement-and-inventory-management-desktop-app/
│
├── electron/                          # Electron Main Process
│   ├── main.ts                       # Main process entry point
│   ├── preload.ts                    # Secure preload script with contextBridge
│   └── ipc/                          # IPC Handlers
│       ├── index.ts                  # Handler registry
│       ├── items.handler.ts          # Items IPC handlers
│       ├── po.handler.ts             # Purchase Orders IPC handlers
│       ├── grn.handler.ts            # GRN IPC handlers
│       ├── receipts.handler.ts       # Receipts IPC handlers
│       ├── categories.handler.ts     # Categories IPC handlers
│       ├── units.handler.ts          # Units IPC handlers
│       ├── warehouses.handler.ts     # Warehouses IPC handlers
│       ├── inventory.handler.ts      # Inventory IPC handlers
│       ├── vendors.handler.ts        # Vendors IPC handlers
│       └── auth.handler.ts           # Authentication IPC handlers
│
├── backend/                          # Backend Business Logic
│   ├── index.ts                      # Backend initialization
│   ├── services/                     # Service Layer (Business Logic)
│   │   ├── item.service.ts          # Items service
│   │   ├── po.service.ts            # Purchase Orders service
│   │   ├── grn.service.ts           # GRN service
│   │   ├── receipt.service.ts       # Receipts service
│   │   ├── category.service.ts      # Categories service
│   │   ├── unit.service.ts          # Units service
│   │   ├── warehouse.service.ts     # Warehouses service
│   │   ├── inventory.service.ts     # Inventory service
│   │   ├── vendor.service.ts        # Vendors service
│   │   └── auth.service.ts          # Authentication service
│   ├── repositories/                 # (Optional) Data access layer
│   └── src/                          # Original backend code
│       ├── db/                       # Database configuration
│       │   ├── index.ts             # Drizzle DB instance
│       │   ├── schema.ts            # Main database schema
│       │   └── schema/
│       │       └── user.schema.ts   # User schema
│       ├── controllers/              # (Legacy - can be removed)
│       ├── routes/                   # (Legacy - can be removed)
│       ├── middlewares/              # (Legacy - can be removed)
│       ├── utils/                    # Utility functions
│       ├── helper/                   # Helper functions
│       ├── validations/              # Validation schemas
│       ├── types/                    # TypeScript types
│       └── seed.ts                   # Database seeding script
│
├── src/                              # Renderer Process (React UI)
│   ├── App.tsx                       # Main App component
│   ├── main.tsx                      # React entry point
│   ├── index.css                     # Global styles
│   ├── components/                   # React components
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── ui/                       # UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── Toast.tsx
│   │   └── ThemeProvider.tsx
│   ├── pages/                        # Application pages
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── Login.tsx
│   │   ├── Products.tsx
│   │   ├── PurchaseOrders.tsx
│   │   ├── Reports.tsx
│   │   ├── Settings.tsx
│   │   ├── Vendors.tsx
│   │   └── masters/
│   │       ├── Categories.tsx
│   │       ├── Units.tsx
│   │       └── Warehouses.tsx
│   ├── services/                     # Frontend services
│   │   └── api.ts                    # IPC communication wrapper
│   ├── store/                        # State management
│   │   └── useStore.ts              # Zustand store
│   └── data/                         # Mock/sample data
│       ├── inventoryTransactions.ts
│       ├── products.ts
│       ├── purchaseOrders.ts
│       └── vendors.ts
│
├── config/                           # Configuration
│   └── env.ts                        # Environment configuration
│
├── dist/                             # Built renderer (generated)
├── dist-electron/                    # Built electron (generated)
├── release/                          # Packaged app (generated)
│
├── .env                              # Environment variables
├── .gitignore                        # Git ignore rules
├── index.html                        # HTML entry point
├── package.json                      # Unified dependencies
├── tsconfig.json                     # Renderer TypeScript config
├── tsconfig.electron.json            # Electron + Backend TypeScript config
├── tsconfig.node.json                # Vite config TypeScript
├── vite.config.ts                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.js                 # PostCSS config
├── README_NEW.md                     # New comprehensive README
├── MIGRATION_GUIDE.md                # Migration guide
└── STRUCTURE.md                      # This file
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     RENDERER PROCESS                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  React Components (src/)                            │    │
│  │  ├── Dashboard.tsx                                  │    │
│  │  ├── Products.tsx                                   │    │
│  │  └── ...                                            │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  API Service (src/services/api.ts)                  │    │
│  │  - window.api.getItems()                            │    │
│  │  - window.api.createItem()                          │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↓ IPC
┌─────────────────────────────────────────────────────────────┐
│                   PRELOAD SCRIPT                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  electron/preload.ts                                │    │
│  │  - contextBridge.exposeInMainWorld('api', {...})    │    │
│  │  - Whitelisted APIs only                            │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↓ IPC
┌─────────────────────────────────────────────────────────────┐
│                     MAIN PROCESS                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  IPC Handlers (electron/ipc/)                       │    │
│  │  - ipcMain.handle('items:getAll', ...)             │    │
│  │  - ipcMain.handle('items:create', ...)             │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Services (backend/services/)                       │    │
│  │  - ItemService.getAllItems()                        │    │
│  │  - ItemService.createItem()                         │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Database (backend/src/db/)                         │    │
│  │  - Drizzle ORM                                      │    │
│  │  - PostgreSQL                                       │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Module Dependencies

### Electron Main Process
```typescript
electron/main.ts
  ├── imports: electron (app, BrowserWindow)
  ├── imports: backend/index.ts (initBackend)
  └── imports: electron/ipc (all handlers)

electron/preload.ts
  ├── imports: electron (contextBridge, ipcRenderer)
  └── exposes: window.api

electron/ipc/*.handler.ts
  ├── imports: electron (ipcMain)
  └── imports: backend/services/*.service.ts
```

### Backend Services
```typescript
backend/services/*.service.ts
  ├── imports: backend/src/db (db instance)
  ├── imports: backend/src/db/schema (tables)
  └── imports: drizzle-orm (eq, and, or, etc.)

backend/index.ts
  ├── imports: backend/src/db (db instance)
  └── exports: initBackend, db
```

### Renderer Process
```typescript
src/services/api.ts
  └── uses: window.api (from preload)

src/pages/*.tsx
  ├── imports: react
  ├── imports: src/services/api.ts
  └── imports: src/store/useStore.ts
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Renderer Process                                   │
│  - No Node.js access (nodeIntegration: false)               │
│  - Only window.api available                                 │
│  - Cannot access filesystem, database, etc.                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Context Isolation                                  │
│  - Separate JavaScript contexts                              │
│  - contextIsolation: true                                    │
│  - Prevents prototype pollution                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Preload Script                                     │
│  - Whitelisted APIs only                                     │
│  - No direct Node.js exposure                                │
│  - Controlled communication bridge                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: IPC Handlers                                       │
│  - Validates requests                                        │
│  - Error handling                                            │
│  - Business logic enforcement                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 5: Service Layer                                      │
│  - Input validation                                          │
│  - Business rules                                            │
│  - Data transformation                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 6: Database                                           │
│  - Schema validation                                         │
│  - Constraints                                               │
│  - Transactions                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Build Process

### Development
```bash
npm run dev
  ├── Starts Vite dev server (port 5173)
  ├── Compiles TypeScript (watch mode)
  └── Launches Electron with hot reload
```

### Production Build
```bash
npm run build
  ├── npm run build:renderer
  │   ├── TypeScript compilation (src/)
  │   └── Vite build → dist/
  └── npm run build:electron
      ├── TypeScript compilation (electron/, backend/)
      └── Output → dist-electron/
```

### Packaging
```bash
npm run package
  ├── Runs build
  ├── electron-builder
  └── Creates installers → release/
```

## 📊 File Count Summary

```
Total Files: ~60-70 files

Breakdown:
- Electron Main: 12 files (main, preload, 10 IPC handlers)
- Backend Services: 10 files (services)
- Backend DB: 5 files (schema, config)
- Renderer: 30+ files (components, pages)
- Config: 8 files (tsconfig, vite, etc.)
- Documentation: 4 files (README, guides)
```

## 🎯 Key Files to Know

### Must Understand
1. `electron/main.ts` - Application entry point
2. `electron/preload.ts` - Security bridge
3. `backend/index.ts` - Backend initialization
4. `src/services/api.ts` - Frontend API wrapper
5. `package.json` - Dependencies and scripts

### Important for Development
6. `electron/ipc/*.handler.ts` - Add new IPC handlers here
7. `backend/services/*.service.ts` - Add business logic here
8. `backend/src/db/schema.ts` - Database schema
9. `config/env.ts` - Environment configuration
10. `vite.config.ts` - Build configuration

### Documentation
11. `README_NEW.md` - Complete guide
12. `MIGRATION_GUIDE.md` - Migration instructions
13. `STRUCTURE.md` - This file

## 🔧 Customization Points

### Adding New Feature

1. **Create Service** → `backend/services/my-feature.service.ts`
2. **Create IPC Handler** → `electron/ipc/my-feature.handler.ts`
3. **Register Handler** → `electron/ipc/index.ts`
4. **Expose in Preload** → `electron/preload.ts`
5. **Update API Service** → `src/services/api.ts`
6. **Create UI** → `src/pages/MyFeature.tsx`

### Adding Database Table

1. **Update Schema** → `backend/src/db/schema.ts`
2. **Generate Migration** → `npm run db:generate`
3. **Run Migration** → `npm run db:migrate`
4. **Create Service** → Follow feature steps above

---

**This structure provides:**
- ✅ Clean separation of concerns
- ✅ Scalable architecture
- ✅ Security best practices
- ✅ Easy to maintain
- ✅ Production-ready
