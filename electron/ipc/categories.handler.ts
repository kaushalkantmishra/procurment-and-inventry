const { ipcMain } = require('electron');
const { CategoryService } = require('../../backend/services/category.service');

const categoryService = new CategoryService();

ipcMain.handle('categories:getAll', async () => {
  return await categoryService.getAllCategories();
});

ipcMain.handle('categories:create', async (_, category) => {
  return await categoryService.createCategory(category);
});
