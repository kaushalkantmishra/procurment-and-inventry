import { ipcMain } from 'electron';
import { ItemService } from '../../backend/services/item.service';

const itemService = new ItemService();

ipcMain.handle('items:getAll', async () => {
  try {
    return await itemService.getAllItems();
  } catch (error: any) {
    return { error: error.message };
  }
});

ipcMain.handle('items:create', async (_, item) => {
  try {
    return await itemService.createItem(item);
  } catch (error: any) {
    return { error: error.message };
  }
});

ipcMain.handle('items:getById', async (_, id) => {
  try {
    return await itemService.getItemById(id);
  } catch (error: any) {
    return { error: error.message };
  }
});
