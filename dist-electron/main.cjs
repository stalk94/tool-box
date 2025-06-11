"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const projectRoot = path.resolve(__dirname, "..");
const PROJECTS_DIR = path.resolve(__dirname, "../public");
const getBounds = () => {
  const displays = electron.screen.getAllDisplays();
  const secondDisplay = displays[1];
  const bounds = secondDisplay.bounds;
  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  };
};
const createWindow = () => {
  const win = new electron.BrowserWindow({
    ...getBounds(),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.maximize();
  win.webContents.openDevTools();
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};
electron.app.whenReady().then(() => {
  createWindow();
  electron.globalShortcut.register("F12", () => {
    const win = electron.BrowserWindow.getFocusedWindow();
    if (win) win.webContents.toggleDevTools();
  });
  electron.ipcMain.handle("dialog:openFile", async () => {
    const result = await electron.dialog.showOpenDialog({ properties: ["openFile"] });
    if (result.canceled || result.filePaths.length === 0) return null;
    const content = fs.readFileSync(result.filePaths[0], "utf-8");
    return content;
  });
  electron.ipcMain.handle("fs:saveFile", async (_event, data) => {
    const result = await electron.dialog.showSaveDialog({});
    if (result.canceled || !result.filePath) return;
    fs.writeFileSync(result.filePath, data, "utf-8");
    return true;
  });
  electron.ipcMain.handle("fs:readFile", async (_event, filePath) => {
    try {
      const absPath = path.resolve(projectRoot, filePath);
      const content = fs.readFileSync(absPath, "utf-8");
      return content;
    } catch (err) {
      return { error: err.message };
    }
  });
  electron.ipcMain.handle("fs:writeFile", async (_event, filePath, content) => {
    try {
      const absPath = path.resolve(projectRoot, filePath);
      fs.writeFileSync(absPath, content, "utf-8");
      return true;
    } catch (err) {
      return { error: err.message };
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
exports.PROJECTS_DIR = PROJECTS_DIR;
