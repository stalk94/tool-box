interface FolderEntry {
	name: string;
	data: any;
}


export interface ElectronAPI {
    openFile: () => Promise<string | null>;
    saveFile: (data: string) => Promise<void>;
    readDir: (path: string) => Promise<string[]>;
    getAppPath: () => Promise<string>;
    readFile: (filePath: string) => Promise<string | { error: string }>;
    writeFile: (filePath: string, content: string) => Promise<string | { error: string }>;
    listFolders: () => Promise<Record<string, FolderEntry[]>>;
    db: {
		get: (key: string) => Promise<any>;
		set: (key: string, value: any) => Promise<void>;
	}
    startNgrock: (token: string) => Promise<string>;
}


declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}