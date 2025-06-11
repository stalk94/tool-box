export interface ElectronAPI {
    openFile: () => Promise<string | null>;
    saveFile: (data: string) => Promise<void>;
    readDir: (path: string) => Promise<string[]>;
    getAppPath: () => Promise<string>;
    readFile: (filePath: string) => Promise<string | { error: string }>;
    writeFile: (filePath: string, content: string) => Promise<true | { error: string }>;
}


declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}