import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import os from 'os';
import { db } from './src/db';
import { authRoutes } from './src/routes/auth.routes';
import { itemRoutes } from './src/routes/item.routes';
import { categoryRoutes } from './src/routes/category.routes';
import { moduleRoutes } from './src/routes/module.routes';
import { unitRoutes } from './src/routes/unit.routes';
import { warehouseRoutes } from './src/routes/warehouse.routes';
import { vendorRoutes } from './src/routes/vendor.routes';
import { grnRoutes } from './src/routes/grn.routes';
import { receiptRoutes } from './src/routes/receipt.routes';
import { purchaseOrderRoutes } from './src/routes/purchaseOrder.routes';
import { poLineRoutes } from './src/routes/poLine.routes';
import { grnHeaderRoutes } from './src/routes/grnHeader.routes';
import { grnDetailRoutes } from './src/routes/grnDetail.routes';
import { purchaseRequestRoutes } from './src/routes/purchaseRequest.routes';
import { inventoryRoutes } from './src/routes/inventory.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Get local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/grn', grnRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/po-lines', poLineRoutes);
app.use('/api/grn-headers', grnHeaderRoutes);
app.use('/api/grn-details', grnDetailRoutes);
app.use('/api/purchase-requests', purchaseRequestRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    await db.execute('SELECT 1');
    console.log('Database connected successfully');
    
    const localIP = getLocalIP();
    
    app.listen(PORT, () => {
      console.log('\n🚀 Server is running on:');
      console.log(`   Local:    http://localhost:${PORT}`);
      console.log(`   Network:  http://${localIP}:${PORT}`);
      console.log('\n📡 API endpoints available at:');
      console.log(`   http://localhost:${PORT}/api`);
      console.log(`   http://${localIP}:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();