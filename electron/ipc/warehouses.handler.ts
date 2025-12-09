const { ipcMain } = require('electron');
const { WarehouseService } = require('../../backend/services/warehouse.service');

const warehouseService = new WarehouseService();

ipcMain.handle('warehouses:getAll', async () => {
  return await warehouseService.getAllWarehouses();
});

ipcMain.handle('warehouses:create', async (_, warehouse) => {
  return await warehouseService.createWarehouse(warehouse);
});
