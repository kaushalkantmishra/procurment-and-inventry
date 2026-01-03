# Backend API Server

Standalone HTTP API server for the Procurement & Inventory Management system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.sample .env
# Edit .env with your database credentials
```

3. Setup database:
```bash
npm run db:push
npm run db:seed
```

4. Start server:
```bash
npm run dev  # Development
npm start    # Production
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout

### Items
- GET `/api/items` - Get all items
- POST `/api/items` - Create item
- GET `/api/items/:id` - Get item by ID

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category

### Units
- GET `/api/units` - Get all units
- POST `/api/units` - Create unit

### Warehouses
- GET `/api/warehouses` - Get all warehouses
- POST `/api/warehouses` - Create warehouse

### Vendors
- GET `/api/vendors` - Get all vendors
- POST `/api/vendors` - Create vendor

### Purchase Orders
- GET `/api/purchase-orders` - Get all purchase orders
- POST `/api/purchase-orders` - Create purchase order

### GRN
- GET `/api/grn` - Get all GRNs
- POST `/api/grn` - Create GRN

### Receipts
- GET `/api/receipts` - Get all receipts
- POST `/api/receipts` - Create receipt

### Inventory
- POST `/api/inventory/stock-in` - Stock in
- POST `/api/inventory/stock-out` - Stock out
- GET `/api/inventory/transactions` - Get transactions

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/procurement_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

The server will run on the port specified in the PORT environment variable (default: 3001).