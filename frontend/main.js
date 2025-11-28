import { app, BrowserWindow } from "electron/main";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load from dev server in development, or built files in production
  if (process.env.NODE_ENV === "development" || !app.isPackaged) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools(); // Open DevTools in development
  } else {
    win.loadFile("dist/index.html");
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
