

/**
 * вызов vite plugin записи файлов 
 * @param folder путь к дерриктории относительно корня проекта
 * @param filename имя файла с разрешением к примеру `test.js`
 * @param content данные
 */
export async function writeFile(folder: string, filename: string, content: string, settings?: {}) {
    const response = await fetch('/write-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, filename, content, settings }),
    });

    return response.text();
}