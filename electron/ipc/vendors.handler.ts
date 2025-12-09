const { ipcMain } = require('electron');
const { VendorService } = require('../../backend/services/vendor.service');

const vendorService = new VendorService();

ipcMain.handle('vendors:getAll', async () => {
  return await vendorService.getAllVendors();
});

ipcMain.handle('vendors:create', async (_, vendor) => {
  return await vendorService.createVendor(vendor);
});
