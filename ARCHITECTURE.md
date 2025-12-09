# Electron Architecture - IPC-Based System

## Architecture Flow

```
Renderer (React)
    ↓
window.api.METHOD()
    ↓
preload.ts (contextBridge)
    ↓
ipcMain.handle() (IPC Handlers)
    ↓
backend.service (Business Logic)
    ↓
backend.repository (Data Access)
    ↓
PostgreSQL (via Drizzle ORM)
```

## Directory Structure

```
backend/
├── repositories/          # Data access layer
│   └── item.repository.ts
├── services/             # Business logic layer
│   ├── item.service.ts
│   ├── category.service.ts
│   └── ...
├── src/
│   └── db/              # Database configuration
│       ├── schema/
│       ├── index.ts
│       └── schema.ts
└── index.ts             # Backend initialization

electron/
├── ipc/                 # IPC handlers (API layer)
│   ├── items.handler.ts
│   ├── categories.handler.ts
│   └── index.ts
├── main.ts              # Main process
└── preload.ts           # Preload script

src/                     # Renderer (React)
├── services/
│   └── api.ts          # API wrapper
└── pages/
    └── Products.tsx
```

## Deleted Files (Express/REST API)

The following Express-related files were removed as they're not needed in Electron:

- ❌ `backend/src/controllers/` - Express controllers
- ❌ `backend/src/routes/` - Express routes
- ❌ `backend/src/middlewares/` - Express middlewares
- ❌ `backend/src/utils/` - Express utilities
- ❌ `backend/src/types/` - Express type definitions
- ❌ `backend/src/validations/` - Express validations
- ❌ `backend/src/server.ts` - Express server

## Key Changes

### 1. Repository Layer Added
- Separates database access from business logic
- Example: `ItemRepository` handles all database operations

### 2. ES6 Modules
- All files now use `import/export` instead of `require/module.exports`
- Better TypeScript support and type safety

### 3. Error Handling
- IPC handlers now wrap calls in try-catch
- Errors returned as `{ error: message }` instead of throwing

### 4. Security
- CSP headers added in main.ts
- Sandbox mode enabled
- No direct Node.js access from renderer

## Example: Item Flow

### 1. Renderer calls API
```typescript
// src/pages/Products.tsx
await apiService.getItems();
```

### 2. API service calls window.api
```typescript
// src/services/api.ts
window.api.getItems();
```

### 3. Preload exposes IPC
```typescript
// electron/preload.ts
getItems: () => ipcRenderer.invoke('items:getAll')
```

### 4. IPC handler receives request
```typescript
// electron/ipc/items.handler.ts
ipcMain.handle('items:getAll', async () => {
  return await itemService.getAllItems();
});
```

### 5. Service processes business logic
```typescript
// backend/services/item.service.ts
async getAllItems() {
  return await this.itemRepo.findAll();
}
```

### 6. Repository queries database
```typescript
// backend/repositories/item.repository.ts
async findAll() {
  return await db.select().from(tblItems)...;
}
```

## Benefits

✅ **No HTTP overhead** - Direct IPC communication
✅ **Type safety** - Full TypeScript support
✅ **Security** - Controlled API surface via preload
✅ **Separation of concerns** - Clear layer boundaries
✅ **Testability** - Each layer can be tested independently
