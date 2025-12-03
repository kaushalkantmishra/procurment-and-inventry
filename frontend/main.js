import { app, BrowserWindow } from "electron/main";
// import expressApp from "../backend/src/server"; // <-- YOUR EXPRESS APP IMPORT

let server; // store express server instance

// const startExpress = () => {
//   const PORT = 3001;

//   server = expressApp.listen(PORT, () => {
//     console.log(`Express running on http://localhost:${PORT}`);
//   });

//   server.on("error", (err) => {
//     console.error("Express failed to start:", err);
//   });
// };

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load from Vite dev or production build
  if (process.env.NODE_ENV === "development" || !app.isPackaged) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile("dist/index.html");
  }
};

app.whenReady().then(() => {
  // startExpress(); // <-- START EXPRESS BEFORE CREATING WINDOW
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // close express when app quits
  if (server) server.close();

  if (process.platform !== "darwin") {
    app.quit();
  }
});
