const { ipcMain } = require('electron');
const { ReceiptService } = require('../../backend/services/receipt.service');

const receiptService = new ReceiptService();

ipcMain.handle('receipts:getAll', async () => {
  return await receiptService.getAllReceipts();
});

ipcMain.handle('receipts:create', async (_, receipt) => {
  return await receiptService.createReceipt(receipt);
});
