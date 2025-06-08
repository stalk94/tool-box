import { db } from "../../helpers/export";
import { createClient } from '@supabase/supabase-js';
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

export async function loadTableData(sourceType: 'json' | 'google' | 'json-url' | 'db', source: string|object): Promise<any[]> {
    try {
        if (sourceType === 'json') {
            if(typeof source === 'string') return JSON.parse(source);
            else return source;
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


export async function testSupabaseConnection(url: string, key: string, table?: string) {
    const supabase = createClient(url, key);

    try {
        const { error } = await supabase.from(table ?? 'kv_store').select('*').limit(1);

        if (error) {
            console.warn('Supabase доступен, но ошибка:', error.message);
            return false;
        }

        return true;
    } 
    catch (e) {
        console.error('Нет соединения с Supabase:', e);
        return false;
    }
}
export function createSupabaseJsonbTableAdapter(config: {
    key: string;
    supabaseUrl: string;
    supabaseKey: string;
    tableName?: string;             // default: 'kv_table'
    pollingInterval?: number;       // ❗️в мс, напр. 5000 = 5с
    onDataChange: (rows: Record<string, any>[]) => void;
}) {
    const table = config.tableName ?? 'kv_table';
    const supabase = createClient(config.supabaseUrl, config.supabaseKey);

    let currentData: Record<string, any>[] = [];
    let pollingTimer: NodeJS.Timeout | null = null;
    let subscribed = false;

    const fetch = async () => {
        const { data, error } = await supabase
            .from(table)
            .select('value')
            .eq('key', config.key)
            .single();

        if (!error && data?.value) {
            currentData = data.value;

            if(Array.isArray(currentData)) config.onDataChange(currentData);
            else if(typeof currentData === 'object') config.onDataChange([currentData]);
            else console.red('❗ load data supabase is not corrected');
        }
    }

    const update = async (newData: Record<string, any>[]) => {
        currentData = newData;
        await supabase
            .from(table)
            .upsert({ key: config.key, value: newData }, { onConflict: 'key' });
    }
    const subscribe = () => {
        if (subscribed) return;
        subscribed = true;

        supabase
            .channel(`table:${table}:${config.key}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table,
                    filter: `key=eq.${config.key}`,
                },
                (payload) => {
                    const newValue = payload.new?.value;
                    if (newValue) {
                        currentData = newValue;
                        config.onDataChange(currentData);
                    }
                }
            )
            .subscribe();
    }

    const startPolling = () => {
        if (pollingTimer) clearInterval(pollingTimer);
        pollingTimer = setInterval(() => {
            fetch();
        }, config.pollingInterval);
    }
    const stop = () => {
        if (pollingTimer) clearInterval(pollingTimer);
    }

    // Автовключение
    if (config.pollingInterval) startPolling();
    else subscribe();

    return {
        fetch,
        update,
        getData: () => currentData,
        stopPolling: stop,
    };
}