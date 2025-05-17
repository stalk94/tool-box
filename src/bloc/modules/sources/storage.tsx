import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { DataTable, DataTableProps } from '../../../index';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { useHookstate } from '@hookstate/core';
import { db } from "../../utils/export";
import { TextInput, NumberInput, PasswordInput, LoginInput, 
    DateInput, SliderInput, ToggleInput, SwitchInput, CheckBoxInput,
    SelectInput, AutoCompleteInput, FileInput
} from '../../../index';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { loadTableData } from './providers';


export type DataSourceTableProps = DataTableProps & {
    dataId: string | number
    style?: React.CSSProperties
    header?: null       // пока отключен
    footer?: null       // пока отключен
    sourceType?: 'json' | 'google' | 'json-url' | 'db'
    refreshInterval?: number;           // интервал в миллисекундах
    source: string                      // URL или JSON-строка или key db (data.users.user)
    // клик по row
    onSelect: (data: Record<string, any>)=> void
}
type ColumnData = {
    field: string 
    header: string
}



export default function StorageDataTable({ style, refreshInterval, dataId, sourceType, source, onChange, footer, ...props }: DataSourceTableProps) {
    const [data, setData] = React.useState([]);
    const [columns, setColumns] = React.useState<ColumnData[]>([]);         // схема колонок
    const [loading, setLoading] = React.useState(false);
    

    // генератор схемы колонок из data, если нет схемы
    const inferColumns = (data: any[]) => {
        const result = [];
        const first = data[0];

        Object.keys(first).map((key) => {
            if(key.length > 0 && key !== 'id') result.push({
                field: key,
                header: key.toUpperCase(),
            })
        });

        return result;
    }
    const handleClick =(field: string, rowIndex: number | 'auto')=> {
        console.log(field, rowIndex);
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
        const loadData = await loadTableData(sourceType, source);

        if(sourceType === 'google' || sourceType === 'db' || sourceType === 'json') {
            setData(loadData);
        }
        
        setLoading(false);
    }, [sourceType, source]);
    React.useEffect(()=> {
        load(); // первичная загрузка

        if (!refreshInterval || refreshInterval < 1000) return;

        const id = setInterval(() => {
            load();
        }, refreshInterval);

        return () => clearInterval(id);
    }, [dataId, source]);
    React.useEffect(()=> {
        if (data.length > 0) {
            const inferred = inferColumns(data);
            setColumns(inferred);
        }
    }, [data]);

    const textEditor = (options) => {
        return (
           <input
                style={{
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    background: 'none',
                    color: 'orange',
                    maxWidth: 100,
                    textAlign: 'center',
                }}
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
           />
        );
    }
    const copy =()=> {
        const list = {
            xslx: exportExcel,
            csv: exportCSV,
            json: exportJSON
        }

        if(footer) {
            const copy = footer.props.children.map((elem)=> {
                const clone = React.cloneElement(elem, {
                    onClick: ()=> list[clone.props.children]()
                });
          
                return clone;
            });
            
            return React.cloneElement(footer, {
                children: copy
            });
            
        }
    }
    

    return(
        <DataTable
            editMode={'cell'}
            dataKey="id"
            style={{ ...style, display: 'block' }}
            value={data}
            fontSizeHead='14px'
            emptyMessage='empty'
            footer={copy()}
            { ...props }
        >
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
                            setData(updated);
                            onChange(updated);
                        }}
                    >
                        ×
                    </button>
                )}
                style={{ width: '30px', textAlign: 'center' }}
            />
            { columns.map((col, i) => (
                <Column 
                    //sortable
                    editor={textEditor}
                    key={col.field} 
                    field={col.field} 
                    header={
                        <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'center' }}>
                            { col.field }
                        </div>
                    }
                    onCellEditComplete = {(e) => {
                        const updated = [...data];
                        updated[e.rowIndex][e.field] = e.newValue;
                        setData(updated);
                        onChange(updated);
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