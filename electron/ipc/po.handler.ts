const { ipcMain } = require('electron');
const { POService } = require('../../backend/services/po.service');

const poService = new POService();

ipcMain.handle('po:getAll', async () => {
  return await poService.getAllPurchaseOrders();
});

ipcMain.handle('po:create', async (_, po) => {
  return await poService.createPurchaseOrder(po);
});
