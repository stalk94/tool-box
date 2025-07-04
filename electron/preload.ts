import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveFile: (data: string) => ipcRenderer.invoke('fs:saveFile', data),
    
    readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: async (filePath, data) => {
		const result = await ipcRenderer.invoke('fs:writeFile', filePath, data);
		if (result?.error) throw new Error(result.error);
		return result; // ← это будет absPath
	},
    listFolders: async () => {
		const result = await ipcRenderer.invoke('db:listFolders');
		if (result?.error) throw new Error(result.error);
		return result;
	},

    db: {
		get: async (key: string) => {
			const result = await ipcRenderer.invoke('db:get', key);
			if (result?.error) throw new Error(result.error);
			return result;
		},
		set: async (key: string, value: any) => {
			const result = await ipcRenderer.invoke('db:set', key, value);
			if (result?.error) throw new Error(result.error);
			return true;
		}
	},
    
    readDir: (dirPath: string) => ipcRenderer.invoke('fs:readDir', dirPath),
    getAppPath: () => ipcRenderer.invoke('sys:getAppPath'),
	startNgrock: (token: string) => ipcRenderer.invoke('ngrock:start', token),
	signInWithGoogle: () => ipcRenderer.invoke('auth:google'),
});