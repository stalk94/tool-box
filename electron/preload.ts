import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveFile: (data: string) => ipcRenderer.invoke('fs:saveFile', data),
    
    readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath: string, data: string) => ipcRenderer.invoke('fs:writeFile', filePath, data),

    // можно расширять:
    readDir: (dirPath: string) => ipcRenderer.invoke('fs:readDir', dirPath),
    getAppPath: () => ipcRenderer.invoke('sys:getAppPath'),
});