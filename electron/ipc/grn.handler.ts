const { ipcMain } = require('electron');
const { GRNService } = require('../../backend/services/grn.service');

const grnService = new GRNService();

ipcMain.handle('grn:getAll', async () => {
  return await grnService.getAllGRNs();
});

ipcMain.handle('grn:create', async (_, grn) => {
  return await grnService.createGRN(grn);
});
