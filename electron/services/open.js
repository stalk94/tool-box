import { dialog, app } from 'electron';


async function pickTsConfig() {
    const result = await dialog.showOpenDialog({
        title: 'Выберите tsconfig.json',
        filters: [{ name: 'TSConfig', extensions: ['json'] }],
        properties: ['openFile'],
    });

    return result.canceled ? null : result.filePaths[0];
}

async function pickSourceFile() {
    const result = await dialog.showOpenDialog({
        title: 'Выберите файл компонента',
        filters: [{ name: 'TSX/TS', extensions: ['ts', 'tsx'] }],
        properties: ['openFile'],
    });

    return result.canceled ? null : result.filePaths[0];
}