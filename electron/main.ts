import { session, app, BrowserWindow, ipcMain, dialog, globalShortcut, screen } from 'electron';
import { copyInitialDataOnce } from './utils/init';
import { initDB, DB } from './utils/db';
import { supabase } from './utils/supabase';
import { startLocalServer } from './utils/server';
import { startNgrock } from './utils/ngrock';
import path from 'path';
import fs from 'fs';


const USER_DATA_DIR = app.getPath('userData');
export const PROJECTS_DIR = path.join(USER_DATA_DIR, 'blocks');
const PORT = 3456;


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

    // ⚠️ Vite dev
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    // prod
    else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}


app.whenReady().then(async() => {
    startLocalServer(PORT);
    session.defaultSession.clearCache();
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    await initDB();
    copyInitialDataOnce();
    createWindow();
    

    // dev tools
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
            const absPath = path.join(USER_DATA_DIR, filePath);
            const content = fs.readFileSync(absPath, 'utf-8');
            return content;
        } 
        catch (err) {
            return { error: err.message };
        }
    });
    ipcMain.handle('fs:writeFile', async (_event, filePath: string, content: string | Buffer) => {
        try {
            const absPath = path.join(USER_DATA_DIR, filePath);
            fs.mkdirSync(path.dirname(absPath), { recursive: true });
            fs.writeFileSync(absPath, Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf-8'));

            const relativeUrl = filePath.replace(/^public[\\/]/, '').replace(/\\/g, '/');
            const url = `http://localhost:${PORT}/${relativeUrl}`;
            return url;
        }
        catch (err) {
            console.error('fs:writeFile error:', err);
            return { error: err.message };
        }
    });
    ipcMain.handle('fs:listFolders', async () => {
        const basePath = PROJECTS_DIR;
        const result = {};

        try {
            const scopes = fs.readdirSync(basePath, { withFileTypes: true })
                .filter((entry) => entry.isDirectory())
                .map((entry) => entry.name);

            for (const scope of scopes) {
                const folderPath = path.join(basePath, scope);
                const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));

                result[scope] = files.map(file => {
                    const filePath = path.join(folderPath, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    return {
                        name: file.replace(/\.json$/, ''),
                        data: JSON.parse(content)
                    };
                });
            }
        } 
        catch (err) {
            return { error: err.message };
        }

        return result;
    });

    // quick db 
    ipcMain.handle('db:get', async (_event, key: string) => {
        try {
            const result = await DB.get(key);
            return result;
        } 
        catch (err) {
            return { error: err.message };
        }
    });
    ipcMain.handle('db:set', async (_event, key: string, value: any) => {
        try {
            await DB.set(key, value);
            return true;
        } 
        catch (err) {
            return { error: err.message };
        }
    });

    // services
    ipcMain.handle('ngrock:start', async (_event, authKey: string) => {
        const url = await startNgrock(PORT, authKey);
        return url;
    });
    ipcMain.handle('auth:google', async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google'
            });

            if (error || !data?.url) {
                console.error('❌ Supabase ошибка:', error?.message);
                return { success: false, error: error?.message || 'No auth URL returned' };
            }

            const win = new BrowserWindow({
                width: 500,
                height: 700,
                show: true,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true
                }
            });

            return await new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    console.warn('⏱ Авторизация не завершена — timeout');
                    win.close();
                    resolve({ success: false, error: 'Timeout or no action' });
                }, 60_000); // 1 минута

                win.webContents.on('will-redirect', (_e, url) => {
                    if (url.includes('error=')) {
                        const err = new URL(url).searchParams.get('error');
                        console.error('❌ Google отказал:', err);
                        clearTimeout(timeout);
                        win.close();
                        resolve({ success: false, error: err });
                        return;
                    }

                    const hash = new URL(url).hash;
                    const token = new URLSearchParams(hash.slice(1)).get('access_token');

                    if (token) {
                        console.log('✅ Токен получен');
                        clearTimeout(timeout);
                        win.close();
                        resolve({ success: true, token });
                    }
                });

                win.on('closed', () => {
                    clearTimeout(timeout);
                    resolve({ success: false, error: 'Окно закрыто пользователем' });
                });

                win.loadURL(data.url);
            });
        } 
        catch (err) {
            console.error('❌ Ошибка в try-catch:', err);
            return { success: false, error: err.message };
        }
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});