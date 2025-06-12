"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => electron.ipcRenderer.invoke("dialog:openFile"),
  saveFile: (data) => electron.ipcRenderer.invoke("fs:saveFile", data),
  readFile: (filePath) => electron.ipcRenderer.invoke("fs:readFile", filePath),
  writeFile: async (filePath, data) => {
    const result = await electron.ipcRenderer.invoke("fs:writeFile", filePath, data);
    if (result == null ? void 0 : result.error) throw new Error(result.error);
    return result;
  },
  listFolders: async () => {
    const result = await electron.ipcRenderer.invoke("fs:listFolders");
    if (result == null ? void 0 : result.error) throw new Error(result.error);
    return result;
  },
  db: {
    get: async (key) => {
      const result = await electron.ipcRenderer.invoke("db:get", key);
      if (result == null ? void 0 : result.error) throw new Error(result.error);
      return result;
    },
    set: async (key, value) => {
      const result = await electron.ipcRenderer.invoke("db:set", key, value);
      if (result == null ? void 0 : result.error) throw new Error(result.error);
      return true;
    }
  },
  readDir: (dirPath) => electron.ipcRenderer.invoke("fs:readDir", dirPath),
  getAppPath: () => electron.ipcRenderer.invoke("sys:getAppPath"),
  startNgrock: (token) => electron.ipcRenderer.invoke("ngrock:start", token)
});
