import { app, BrowserWindow, ipcMain, dialog, globalShortcut, screen } from 'electron';
import path from 'path';
import fs from 'fs';

const projectRoot = path.resolve(__dirname, '..');
export const PROJECTS_DIR = path.resolve(__dirname, '../public'); 

const getBounds =()=> {
    const displays = screen.getAllDisplays();
    const secondDisplay = displays[1];  
    const bounds = secondDisplay.bounds;
    
    return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
    }
}

const createWindow = () => {
    const win = new BrowserWindow({
        ...getBounds(),
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'), 
            contextIsolation: true,       
            nodeIntegration: false,          
        },
    });
    win.maximize();
    win.webContents.openDevTools();

    // ⚠️ Vite dev или прод
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}


app.whenReady().then(() => {
    createWindow();

    globalShortcut.register('F12', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) win.webContents.toggleDevTools();
    });

    // окно загрузчика файлов
    ipcMain.handle('dialog:openFile', async () => {
        const result = await dialog.showOpenDialog({ properties: ['openFile'] });
        if (result.canceled || result.filePaths.length === 0) return null;

        const content = fs.readFileSync(result.filePaths[0], 'utf-8');
        return content;
    });
    ipcMain.handle('fs:saveFile', async (_event, data: string) => {
        const result = await dialog.showSaveDialog({});
        if (result.canceled || !result.filePath) return;

        fs.writeFileSync(result.filePath, data, 'utf-8');
        return true;
    });

    // FS api
    ipcMain.handle('fs:readFile', async (_event, filePath: string) => {
        try {
            const absPath = path.resolve(projectRoot, filePath);
            const content = fs.readFileSync(absPath, 'utf-8');
            return content;
        } 
        catch (err) {
            return { error: err.message };
        }
    });
    ipcMain.handle('fs:writeFile', async (_event, filePath: string, content: string) => {
        try {
            const absPath = path.resolve(projectRoot, filePath);
            fs.writeFileSync(absPath, content, 'utf-8');
            return true;
        } 
        catch (err) {
            return { error: err.message };
        }
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});