import { db } from "../../utils/export";
const testId = '14Jy8ozyC4nmjopCdaCWBZ48eFrJE4BneWuA3CMrHodE';


/** только для публичной */
export async function fetchGoogleSheet(sheetId?: string): Promise<any[]> {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId??testId}/gviz/tq?tqx=out:json`;
        const res = await fetch(url);
        const text = await res.text();

        const jsonText = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?/s)?.[1];
        if (!jsonText) throw new Error('Не удалось извлечь JSON');

        const json = JSON.parse(jsonText);
        const rows = json.table.rows;

        // ⚠ Берем первую строку как заголовки
        const headerRow = rows[0].c.map(cell => cell?.v ?? '');
        const dataRows = rows.slice(1);

        const result = dataRows.map((row) => {
            const obj: Record<string, any> = {};
            row.c.forEach((cell, i) => {
                const header = headerRow[i];
                obj[header] = cell?.v ?? '';
            });
            return obj;
        });

        return result;
    } 
    catch (err) {
        console.warn('⚠️ Ошибка загрузки Google Sheets: ', err);
    }
}

export async function fetchJson(source: string) {
    try {
        const res = await fetch(source);
        return await res.json();
    }
    catch (err) {
        console.warn('⚠️ Ошибка загрузки JSON: ', err);
    }
}

export async function loadTableData(sourceType: 'json' | 'google' | 'json-url' | 'db', source: string): Promise<any[]> {
    try {
        if (sourceType === 'json') {
            return JSON.parse(source);
        }
        if (sourceType === 'json-url') {
            return await fetchJson(source);
        }
        if (sourceType === 'google') {
            return await fetchGoogleSheet(source);
        }
        if (sourceType === 'db') {
            return await db.get(`STORAGES.${source}`);
        }

        throw new Error(`Неподдерживаемый sourceType: ${sourceType}`);
    } 
    catch (err) {
        return [];
    }
}