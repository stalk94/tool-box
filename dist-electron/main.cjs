"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const fs = require("fs");
const path = require("path");
const lowdb = require("lowdb");
const node = require("lowdb/node");
const lodash = require("lodash");
const express = require("express");
const ngrok = require("ngrok");
function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
function copyInitialDataOnce() {
  const targetBlocksPath = path.join(electron.app.getPath("userData"), "blocks");
  const sys = path.join(electron.app.getPath("userData"), "blocks/system");
  if (fs.existsSync(sys)) return;
  !electron.app.isPackaged;
  const sourceBlocksPath = path.join(process.cwd(), "public/blocks");
  console.log("Copying from:", sourceBlocksPath);
  if (!fs.existsSync(sourceBlocksPath)) {
    console.warn("❌ Source blocks folder not found");
    return;
  }
  copyRecursiveSync(sourceBlocksPath, targetBlocksPath);
  console.log("✅ Blocks copied to userData");
}
const filePath = path.join(electron.app.getPath("userData"), "storage.json");
const adapter = new node.JSONFile(filePath);
const db = new lowdb.Low(adapter, {});
const INIT_FLAG = "__INIT__";
const initDB = async () => {
  await db.read();
  db.data || (db.data = {});
  if (!db.data[INIT_FLAG]) {
    console.log("🔧 DB first-time init");
    Object.assign(db.data, {
      [INIT_FLAG]: true,
      BLOCK: {
        any: [],
        favorite: []
      }
    });
    await db.write();
  } else {
    console.log("✅ DB already initialized");
  }
};
const DB = {
  async get(path2) {
    await db.read();
    return lodash.get(db.data, path2);
  },
  async set(path2, value) {
    lodash.set(db.data, path2, value);
    await db.write();
  },
  async has(path2) {
    await db.read();
    return typeof lodash.get(db.data, path2) !== "undefined";
  },
  async delete(path2) {
    lodash.unset(db.data, path2);
    await db.write();
  }
};
function startLocalServer(port = 3456, authToken) {
  const server = express();
  const publicDir = path.join(electron.app.getPath("userData"), "public");
  const pageDir = path.join(electron.app.getPath("userData"), "page");
  server.use("/", express.static(publicDir));
  server.get("*", (req, res) => {
    const route = req.path === "/" ? "/index" : req.path;
    const htmlFilePath = path.join(pageDir, `${route}.html`);
    if (fs.existsSync(htmlFilePath)) {
      return res.sendFile(htmlFilePath);
    }
    res.status(404).send("Not found");
  });
  server.listen(port, () => {
    console.log(`📦 Local file server running at http://localhost:${port}/`);
  });
}
async function startNgrock(port, authToken) {
  if (!authToken) return;
  try {
    await ngrok.authtoken(authToken);
    const url = await ngrok.connect({ addr: port });
    return url;
  } catch (e) {
    console.error("❌ ngrock start failed", e);
  }
}
const USER_DATA_DIR = electron.app.getPath("userData");
const PROJECTS_DIR = path.join(USER_DATA_DIR, "blocks");
const PORT = 3456;
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
electron.app.whenReady().then(async () => {
  startLocalServer(PORT);
  electron.session.defaultSession.clearCache();
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  await initDB();
  copyInitialDataOnce();
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
  electron.ipcMain.handle("fs:readFile", async (_event, filePath2) => {
    try {
      const absPath = path.join(USER_DATA_DIR, filePath2);
      const content = fs.readFileSync(absPath, "utf-8");
      return content;
    } catch (err) {
      return { error: err.message };
    }
  });
  electron.ipcMain.handle("fs:writeFile", async (_event, filePath2, content) => {
    try {
      const absPath = path.join(USER_DATA_DIR, filePath2);
      fs.mkdirSync(path.dirname(absPath), { recursive: true });
      fs.writeFileSync(absPath, Buffer.isBuffer(content) ? content : Buffer.from(content, "utf-8"));
      const relativeUrl = filePath2.replace(/^public[\\/]/, "").replace(/\\/g, "/");
      const url = `http://localhost:${PORT}/${relativeUrl}`;
      return url;
    } catch (err) {
      console.error("fs:writeFile error:", err);
      return { error: err.message };
    }
  });
  electron.ipcMain.handle("fs:listFolders", async () => {
    const basePath = PROJECTS_DIR;
    const result = {};
    try {
      const scopes = fs.readdirSync(basePath, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
      for (const scope of scopes) {
        const folderPath = path.join(basePath, scope);
        const files = fs.readdirSync(folderPath).filter((file) => file.endsWith(".json"));
        result[scope] = files.map((file) => {
          const filePath2 = path.join(folderPath, file);
          const content = fs.readFileSync(filePath2, "utf8");
          return {
            name: file.replace(/\.json$/, ""),
            data: JSON.parse(content)
          };
        });
      }
    } catch (err) {
      return { error: err.message };
    }
    return result;
  });
  electron.ipcMain.handle("db:get", async (_event, key) => {
    try {
      const result = await DB.get(key);
      return result;
    } catch (err) {
      return { error: err.message };
    }
  });
  electron.ipcMain.handle("db:set", async (_event, key, value) => {
    try {
      await DB.set(key, value);
      return true;
    } catch (err) {
      return { error: err.message };
    }
  });
  electron.ipcMain.handle("ngrock:start", async (_event, authKey) => {
    const url = await startNgrock(PORT, authKey);
    return url;
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
exports.PROJECTS_DIR = PROJECTS_DIR;
