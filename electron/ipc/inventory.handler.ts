const { ipcMain } = require('electron');
const { InventoryService } = require('../../backend/services/inventory.service');

const inventoryService = new InventoryService();

ipcMain.handle('inventory:stockIn', async (_, data) => {
  return await inventoryService.stockIn(data);
});

ipcMain.handle('inventory:stockOut', async (_, data) => {
  return await inventoryService.stockOut(data);
});

ipcMain.handle('inventory:getTransactions', async () => {
  return await inventoryService.getTransactions();
});
