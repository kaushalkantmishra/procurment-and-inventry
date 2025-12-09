const { ipcMain } = require('electron');
const { UnitService } = require('../../backend/services/unit.service');

const unitService = new UnitService();

ipcMain.handle('units:getAll', async () => {
  return await unitService.getAllUnits();
});

ipcMain.handle('units:create', async (_, unit) => {
  return await unitService.createUnit(unit);
});
