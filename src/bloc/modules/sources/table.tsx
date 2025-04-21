import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { DataTable, DataTableProps } from '../../../index';
import { ComponentProps } from '../../type';
import { deserializeJSX } from '../../utils/sanitize';
import { iconsList } from '../../../components/tools/icons';
import { Column } from 'primereact/column';
import { useHookstate } from '@hookstate/core';
import { loadTableData } from './providers';


export type DataSourceTableProps = {
    dataId: string | number
    style?: React.CSSProperties
    sourceType?: 'json' | 'google' | 'json-url'
    refreshInterval?: number;           // интервал в миллисекундах
    source: string                      // URL или JSON-строка
    header?: null       // пока отключен
    footer?: null       // пока отключен
    // клик по row
    onSelect: (data: Record<string, any>)=> void
}
type ColumnData = {
    field: string 
    header: string
}


export default function({ style, dataId, sourceType, source, refreshInterval, ...props }: DataSourceTableProps) {
    const [data, setData] = React.useState([]);
    const [columns, setColumns] = React.useState<ColumnData[]>([]);         // схема колонок
    const [loading, setLoading] = React.useState(false);
    

    // генератор схемы колонок из data, если нет схемы
    const inferColumns = (data: any[]) => {
        const result = [];
        const first = data[0];

        Object.keys(first).map((key) => {
            if(key.length > 0) result.push({
                field: key,
                header: key.toUpperCase(),
            })
        });

        return result;
    }
    // props.onLoad && props.onLoad();
    const load = React.useCallback(async () => {
        setLoading(true);
        const rows = await loadTableData(sourceType, source);
        setData(rows);
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
        if (data.length > 0 && columns.length === 0) {
            const inferred = inferColumns(data);
            setColumns(inferred);
        }
    }, [data]);
    //console.log(props.width)

    return(
        <DataTable
            data-id={dataId}
            data-type='DataTable'
            style={{ ...style, width: props.width, height: props.height, display: 'block' }}
            value={data}
            onRowClick={(e)=> props?.onSelect?.(e.data)}
            header={
                <div style={{ fontSize: 12, color: 'gray' }}>
                    { loading && <><CircularProgress size='13'/> Обновление данных...</> }
                </div>
            }
        >
            { columns.map((col) => (
                <Column 
                    sortable
                    key={col.field} 
                    field={col.field} 
                    header={col.header} 
                />
            ))}
        </DataTable>
    );
}