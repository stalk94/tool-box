/**
 * вызов vite plugin записи файлов 
 * @param folder путь к дерриктории относительно корня проекта
 * @param filename имя файла с разрешением к примеру `test.js`
 * @param content данные
 */
export async function writeFile(folder: string, filename: string, content: string, settings?: {}) {
    const route = window.next ? '/api/write-file' : '/write-file';
    const response = await fetch(route, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, filename, content, settings }),
    });

    return response.text();
}

export async function uploadFile(blob: Blob, filename?: string): Promise<string> {
    const route = window.next ? '/api/write-file' : '/write-file';
    console.log(route)
    const mime = blob.type;
    const ext = mime.split('/')[1] || 'bin';
    const name = filename ?? `file-${Date.now()}.${ext}`;

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;

                const body = JSON.stringify({
                    folder: 'public/uploads',
                    filename: name,
                    content,
                    settings: { image: mime.startsWith('image/'), binary: true },
                });

                const res = await fetch(route, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body,
                });

                if (!res.ok) return reject('Write file failed');
                resolve(`/uploads/${name}`);
            } 
            catch (err) {
                reject(err);
            }
        };

        reader.readAsDataURL(blob); // читаем как base64
    });
}
