"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => electron.ipcRenderer.invoke("dialog:openFile"),
  saveFile: (data) => electron.ipcRenderer.invoke("fs:saveFile", data),
  readFile: (filePath) => electron.ipcRenderer.invoke("fs:readFile", filePath),
  writeFile: (filePath, data) => electron.ipcRenderer.invoke("fs:writeFile", filePath, data),
  // можно расширять:
  readDir: (dirPath) => electron.ipcRenderer.invoke("fs:readDir", dirPath),
  getAppPath: () => electron.ipcRenderer.invoke("sys:getAppPath")
});
