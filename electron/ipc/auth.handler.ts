const { ipcMain } = require('electron');
const { AuthService } = require('../../backend/services/auth.service');

const authService = new AuthService();

ipcMain.handle('auth:login', async (_, credentials) => {
  return await authService.login(credentials);
});

ipcMain.handle('auth:register', async (_, userData) => {
  return await authService.register(userData);
});

ipcMain.handle('auth:logout', async () => {
  return await authService.logout();
});

ipcMain.handle('auth:getCurrentUser', async () => {
  return await authService.getCurrentUser();
});
