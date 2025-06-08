import React from 'react';
import * as XLSX from 'xlsx';
import { hash } from 'spark-md5';
import CircularProgress from '@mui/material/CircularProgress';
import { DataTable, DataTableProps } from '../../../index';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { db } from "../../helpers/export";
import { AddBox, PlaylistAdd } from '@mui/icons-material';
import { saveAs } from 'file-saver';
import { loadTableData, createSupabaseJsonbTableAdapter } from './providers';
import { Button } from '@mui/material';
import { detectFieldType, FieldType } from '../helpers/format';
import EditorTableData, { FormAddColumn } from './EditorTableData';


////////////////////////////////////////////////////////////////////
export type TableDataFormat = Record<string, any>[];
/** ! структура таблицы supabase должна быть `key - primary key, type string`, `value - jsonb type` */
export type SupabaseAuthData = {
    /** key являюгийся первичным ключем, идентификатором row в таблице supabase */
    key: string
    url: string
    tableName?: string
    anonKey: string
    pollingInterval?: number
}
export type DataSourceTableProps = DataTableProps & {
    mod?: 'edit' | 'binding'
    dataId: string | number
    style?: React.CSSProperties
    sourceType?: 'json' | 'google' | 'json-url' | 'db' | 'supabase'
    config?: SupabaseAuthData
    refreshInterval?: number;           // интервал в миллисекундах
    source?: string | []                    // URL или JSON-строка или key db (data.users.user)
    file?: any
    // клик по row
    onChange: (data: TableDataFormat)=> void
    onSelect: (data: Record<string, any>)=> void
}
type ColumnData = {
    field: string 
    header: string
}
////////////////////////////////////////////////////////////////////


export default function StorageDataTable({ 
    style, 
    refreshInterval, 
    dataId, 
    sourceType, 
    source, 
    onChange, 
    header, 
    footer, 
    file,
    config, 
    mod,
    ...props 
}: DataSourceTableProps) {
    const adapter = React.useRef<ReturnType<typeof createSupabaseJsonbTableAdapter> | null>(null);
    const lastPushHash = React.useRef<string | null>('1');
    const lastFileRef = React.useRef<number | null>(null);
    const [data, setData] = React.useState([]);
    const [columns, setColumns] = React.useState<ColumnData[]>([]);         // схема колонок
    const [loading, setLoading] = React.useState(false);
    const [addModal, setAddModal] = React.useState<React.ReactElement|undefined>();
    

    const inferColumns = (data: TableDataFormat) => {
        if (data.length > 0) {
            const result = [];
            const first = data[0];
            
            Object.keys(first).map((key) => {
                if(key.length > 0 && key !== 'id') result.push({
                    field: key,
                    header: key.toUpperCase(),
                    type: detectFieldType(data.map(row => row[key]))
                });
            });

            setColumns(result);
        }
        else setColumns([]);
    }
    const syncAndSetData = (newData: TableDataFormat, infer?: boolean) => {
        setData(newData);
        onChange(newData);
        
        if (sourceType === 'supabase') {
            lastPushHash.current = hash(JSON.stringify(newData));
            adapter.current?.update(newData);
            if(infer) inferColumns(newData);
        }
    }
    const handleUpload = (file: File) => {
        const ext = file.name.split('.').pop()?.toLowerCase();

        const handleJSONImport = (file: File) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const json = JSON.parse(reader.result as string);
                    if (Array.isArray(json)) syncAndSetData(json, true);
                    else alert('Ожидается массив объектов в JSON');
                }
                catch (err) { alert('Ошибка чтения JSON'); }
            }
            reader.readAsText(file);
        }
        const handleCSVImport = (file: File) => {
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result as string;
                const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

                if (lines.length === 0) return;

                const headers = lines[0].split(',');
                const parsedData = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const row: Record<string, any> = {};
                    headers.forEach((h, i) => {
                        row[h] = values[i];
                    });
                    return row;
                });

                syncAndSetData(parsedData, true);
            };
            reader.readAsText(file);
        }
        const handleExcelImport = (file: File) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(worksheet);

                syncAndSetData(parsedData, true);
            }
            reader.readAsArrayBuffer(file);
        }

        if (ext === 'json') {
            handleJSONImport(file);
        } else if (ext === 'csv') {
            handleCSVImport(file);
        } else if (ext === 'xlsx' || ext === 'xls') {
            handleExcelImport(file);
        } else {
            alert('Неподдерживаемый формат');
        }
    }
    const handleClick =(field: string, rowIndex: number | 'auto')=> {
        console.log(field, rowIndex);
    }
    const handleAddRow = () => {
        setData((old) => {
            const copyData = { ...old[0] };

            Object.keys(copyData).map((key) => {
                const find = columns.find((p)=> p.header === key);
                if(find) {
                    if(find.type === 'number') copyData[key] = 0;
                    else if(find.type === 'boolean') copyData[key] = false;
                    else if(find.type === 'object') copyData[key] = {};
                    else if(find.type === 'array') copyData[key] = [];
                    else copyData[key] = '';
                }
                else copyData[key] = '';
            });
            const update = [...old, copyData];

            syncAndSetData(update);
            return update;
        });
    }
    const handleAddField = () => {
        const handle = (find: false|{key:string, type:FieldType}) => {
            console.log(find)
            if(find === false) {
                setAddModal(undefined);
                return;
            }

            let value;
            if(find.type === 'number') value = 0;
            else if(find.type === 'boolean') value = false;
            else if(find.type === 'object') value = {};
            else if(find.type === 'array') value = [];
            else value = '';

            setData((old) => { 
                const updated = old.map((row) => ({
                    ...row,
                    [find.key]: value,
                }));
                
                syncAndSetData([...updated], true);
                return old;
            });
            setAddModal(undefined);
        }

        setAddModal(
            <FormAddColumn
                setClose={handle}
            />
        );
    }
    const exportCSV = () => {
        const escapeCSV = (value: any) => {
            const str = String(value ?? '');
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`; // оборачиваем в кавычки и экранируем кавычки внутри
            }
            return str;
        }
        const headers = columns.map(col => escapeCSV(col.field)).join(',');
        const rows = data.map(row =>
            columns.map(col => escapeCSV(row[col.field])).join(',')
        );
        const csvContent = [headers, ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(blob, 'data.xlsx');
    }
    const exportJSON = () => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    }


    const load = React.useCallback(async () => {
        setLoading(true);

        if(sourceType === 'google' || sourceType === 'db' || sourceType === 'json') {
            const loadData = await loadTableData(sourceType, source);
            setData(loadData);
            inferColumns(loadData);
            setLoading(false);
        }
        else if (!adapter.current && sourceType === 'supabase' && config && typeof config === 'object') {
            const { key, url, anonKey, pollingInterval, tableName } = config;

            const inst = createSupabaseJsonbTableAdapter({
                key,
                supabaseUrl: url,
                supabaseKey: anonKey,
                tableName,
                pollingInterval,
                onDataChange: (rows) => {
                    if(EDITOR) {
                        const incomingHash = hash(JSON.stringify(rows));
                        if (incomingHash === lastPushHash.current) return;
                    }

                    setData(rows);
                    onChange(rows);
                    inferColumns(rows);
                }
            });

            adapter.current = inst;
            inst.fetch().then(()=> {
                setLoading(false);
            });
        }
    }, [sourceType, source, config]);
    const headerEditorRender = React.useCallback(() => {
        if (EDITOR) return (
            <div style={{ fontSize: 12, color: 'gray', height: 30, display: 'flex', flexDirection: 'row', padding: 3 }}>
                <div className='buttontable'
                    style={{ marginLeft: 10, cursor: 'pointer', color: 'silver' }}
                    onClick={handleAddField}
                >
                    <AddBox sx={{ fontSize: 24 }} />
                </div>
                <div className='buttontable'
                    style={{ marginLeft: 15, cursor: 'pointer', color: 'silver' }}
                    onClick={handleAddRow}
                >
                    <PlaylistAdd sx={{ fontSize: 26 }} />
                </div>
            </div>
        );
        else return header;
    }, [data]);
    const footerEditorRender = React.useCallback(() => {
        if (EDITOR) return (
            <div style={{ display: 'flex', marginLeft: 'auto' }}>
                <Button
                    variant='outlined'
                    color='navigation'
                    size='small'
                    sx={{ p: 0.2, m: 0, mr: 0.3, opacity: 0.6, fontSize: 10 }}
                    onClick={exportCSV}
                >
                    csv
                </Button>
                <Button
                    variant='outlined'
                    color='navigation'
                    size='small'
                    sx={{ p: 0.2, m: 0, mr: 0.3, opacity: 0.6, fontSize: 10 }}
                    onClick={exportExcel}
                >
                    xslx
                </Button>
                <Button
                    variant='outlined'
                    color='navigation'
                    size='small'
                    sx={{ p: 0.2, m: 0, mr: 0.3, opacity: 0.6, fontSize: 10 }}
                    onClick={exportJSON}
                >
                    json
                </Button>
            </div>
        );
        else return header;
    }, [data]);


    React.useEffect(()=> {
        load();                     // первичная загрузка и init
        if (!refreshInterval || refreshInterval < 1000) return;

        const id = setInterval(load, refreshInterval);

        return () => clearInterval(id);
    }, [dataId, source, config]);
    React.useEffect(() => {
        if (!EDITOR) return;

        if (file instanceof File) {
            const id = file.lastModified;

            if (id !== lastFileRef.current) {
                lastFileRef.current = id;
                handleUpload(file);
            }
        }
    }, [file]);
    React.useEffect(() => {
        return () => {
            adapter.current?.destroy?.();
            adapter.current = null;
        };
    }, []);



    return(
        <DataTable
            editMode={'cell'}
            dataKey="id"
            style={{ ...style, display: 'block' }}
            value={data}
            fontSizeHead='14px'
            emptyMessage='empty'
            footer={footerEditorRender()}
            header={headerEditorRender()}
            { ...props }
        >
            { (EDITOR && mod !== 'binding') &&
                <Column
                    key="actions"
                    body={(rowData, colProps) => (
                        <button
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'red',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                const updated = data.filter((_, idx) => idx !== colProps.rowIndex);
                                syncAndSetData(updated, true);
                            }}
                        >
                            ×
                        </button>
                    )}
                    style={{ width: '30px', textAlign: 'center' }}
                />
            }
            { columns.map((col, i) => (
                <Column 
                    key={col.field + i} 
                    sortable={(mod === 'binding' || !EDITOR)}
                    editor={(o)=> (EDITOR && mod !== 'binding') && (
                        <EditorTableData
                            value={o.value}
                            onChange={o.editorCallback}
                            type={col.type}
                        />
                    )}
                    field={col.field} 
                    header={
                        <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'center' }}>
                            { col.field }
                            { addModal }
                        </div>
                    }
                    onCellEditComplete = {async (e) => {
                        if(EDITOR) {
                            const updated = [...data];
                            updated[e.rowIndex][e.field] = e.newValue;
                            syncAndSetData(updated);
                        }
                    }}
                    body={(rowData, colProps) => {
                        return (
                            <span
                                style={{ cursor: 'pointer', fontSize:'12px' }}
                                onClick={()=> handleClick(col.field, colProps.rowIndex)}
                            >
                                { rowData[col.field] }
                            </span>
                        );
                    }}
                />
            ))}
        </DataTable>
    );
}