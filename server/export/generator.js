import fs from 'fs/promises';
import path from 'path';

export async function writeComponentBuildFiles(tag, schema, themeName, customName) {
    const basePath = path.resolve(__dirname, '../../tmp', tag);
    await fs.mkdir(basePath, { recursive: true });

    const schemaLiteral = JSON.stringify(schema, null, 2);
    const content = `
        import { registerWebComponent } from 'src/bloc/modules/export/web-component.wc.tsx';
        import { ${themeName} as theme } from 'src/theme';

        const schema = ${schemaLiteral};
        registerWebComponent(schema, theme, ${customName});
    `.trim();

    const filePath = path.join(basePath, 'Generated.wc.tsx');
    await fs.writeFile(filePath, content);

    // Жёсткая проверка, что файл точно появился и доступен
    let retries = 10;
    while (retries-- > 0) {
        try {
            await fs.access(filePath);
            return filePath;
        } catch {
            await new Promise((r) => setTimeout(r, 50)); // подождать 50ms
        }
    }

    throw new Error('Файл не доступен после записи: ' + filePath);
}