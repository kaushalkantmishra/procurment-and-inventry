# Procurement & Inventory Management Desktop App

A full-stack desktop application for managing procurement and inventory operations.

## Features

- **Items Management**: Create and manage product catalog
- **Purchase Orders**: Create and track purchase orders
- **Goods Receipt Notes (GRN)**: Record incoming inventory
- **Receipts**: Track sales and outgoing inventory
- **Real-time Inventory**: Monitor stock levels and transactions

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- RESTful APIs

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- Electron (Desktop App)

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd procurement-and-inventory-management-desktop-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/procurement_db
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   npm run migrate
   npm run seed
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start Development Servers**
   
   **Option 1: Use the batch script (Windows)**
   ```bash
   # From root directory
   start-dev.bat
   ```

   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## API Endpoints

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item by ID

### Purchase Orders
- `GET /api/po` - Get all purchase orders
- `POST /api/po` - Create new purchase order

### GRN (Goods Receipt Notes)
- `GET /api/grn` - Get all GRNs
- `POST /api/grn` - Create new GRN

### Receipts
- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt

### Categories & Units
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/units` - Get all units
- `POST /api/units` - Create new unit

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Database Operations
```bash
cd backend
npm run generate  # Generate new migrations
npm run migrate   # Run migrations
npm run seed      # Seed initial data
```

## Building for Production

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

### Electron App
```bash
cd frontend
npm run electron:dev  # Development mode
npm run build && npm run electron  # Production build
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── routes/         # API routes
│   │   ├── db/            # Database configuration
│   │   ├── server.ts      # Express server
│   │   └── seed.ts        # Database seeding
│   ├── drizzle/           # Database migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   └── App.tsx
│   ├── electron/         # Electron configuration
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License