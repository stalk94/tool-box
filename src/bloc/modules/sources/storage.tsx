import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { DataTable, DataTableProps } from '../../../index';
import { useStorageContext, useInfoState, useEditorContext } from '../../context';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { useHookstate } from '@hookstate/core';
import { db } from "../../utils/export";
import { TextInput, NumberInput, PasswordInput, LoginInput, 
    DateInput, SliderInput, ToggleInput, SwitchInput, CheckBoxInput,
    SelectInput, AutoCompleteInput, FileInput
} from '../../../index';
import { Add, AddBox, PlaylistAdd } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';


export type DataSourceTableProps = {
    dataId: string | number
    style?: React.CSSProperties
    refreshInterval?: number;           // интервал в миллисекундах
    header?: null       // пока отключен
    footer?: null       // пока отключен
    dbKey: string 
    // клик по row
    onSelect: (data: Record<string, any>)=> void
}
type ColumnData = {
    field: string 
    header: string
}



export default function StorageDataTable({ style, dbKey, refreshInterval, ...props }: DataSourceTableProps) {
    const [data, setData] = React.useState([]);
    const [editing, setEditing] = React.useState<boolean>(true);            // false - режим связывания переменной на конкретный index
    const [columns, setColumns] = React.useState<ColumnData[]>([]);         // схема колонок
    const [loading, setLoading] = React.useState(false);
    const loadStorages = useHookstate(useStorageContext());
    const activeEditor = useHookstate(useInfoState().activeEditorTipTop);
    

    // генератор схемы колонок из data, если нет схемы
    const inferColumns = (data: any[]) => {
        const result = [];
        const first = data[0];

        Object.keys(first).map((key) => {
            if(key.length > 0 && key!=='id') result.push({
                field: key,
                header: key.toUpperCase(),
            })
        });

        return result;
    }
    const handleClick =(name: string, rowIndex: number|'auto')=> {
        if(activeEditor.value) {
            activeEditor.value.chain().focus().insertContent({
                type: 'variable',
                attrs: {
                    name: name,
                    rowIndex: rowIndex,
                    db: dbKey
                }
            }).run();
        }
    }
    const handleAddRow = () => {
        // создаём объект со всеми ключами из схемы и пустыми значениями
        const newRow = columns.reduce((acc, col) => {
            acc[col.field] = '';
            return acc;
        }, { id: data.length });

        const updated = [...data, newRow];
        setData(updated);
        db.set(`STORAGES.${dbKey}`, updated);
    }
    // props.onLoad && props.onLoad();
    const load = React.useCallback(async () => {
        setLoading(true);
        const rows = await db.get(`STORAGES.${dbKey}`);
        if(rows) setData(rows.map((row, i) => ({ id: i, ...row })));

        setLoading(false);
       
    }, [dbKey]);

    React.useEffect(()=> {
        load(); // первичная загрузка

        if (!refreshInterval || refreshInterval < 1000) return;

        const id = setInterval(() => {
            load();
        }, refreshInterval);

        return () => clearInterval(id);
    }, [dbKey]);
    React.useEffect(()=> {
        if (data.length > 0 && columns.length === 0) {
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
                    textAlign: 'center',
                }}
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
           />
        );
    }
    const handleAddField = () => {
        const newField = prompt('Название нового поля');
        if (!newField) return;

        const updated = data.map((row) => ({
            ...row,
            [newField]: '',
        }));
        if(updated.length === 0) updated.push({[newField]: ''})

        setData(updated);
        setColumns(inferColumns(updated));

        console.log(updated)
        db.set(`STORAGES.${dbKey}`, updated);
    }
    

    return(
        <DataTable
            editMode={editing ? 'cell' : undefined}
            dataKey="id"
            style={{ ...style, width: props.width, height: props.height, display: 'block' }}
            value={data}
            fontSizeHead='10px'
            onRowEditInit={(e) => console.log('INIT EDIT ROW: ', e.index)}
            header={
                <div style={{ fontSize: 12, color: 'gray',height:23, display:'flex',flexDirection:'row',padding:3 }}>
                    <div className='buttontable' style={{marginLeft:10,cursor:'pointer',color:'silver'}} onClick={handleAddField}>
                        <AddBox sx={{fontSize:18}} />
                    </div>
                    <div className='buttontable' style={{marginLeft:15,cursor:'pointer',color:'silver'}} onClick={handleAddRow}>
                        <PlaylistAdd sx={{ fontSize: 22 }} />
                    </div>
                </div>
            }
            emptyMessage='empty'
        >
            { columns.map((col) => (
                <Column 
                    //sortable
                    editor={textEditor}
                    key={col.field} 
                    field={col.field} 
                    header={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <span>{col.field}</span>
                            <div className='buttontable' style={{marginLeft:10,cursor:'pointer',color:'silver'}} 
                                onClick={()=> handleClick(col.field, 'auto')}
                            >
                                <Add sx={{ fontSize: 16 }} />
                            </div>
                        </Box>
                      }
                    onCellEditComplete = {(e) => {
                        const updated = [...data];
                        updated[e.rowIndex][e.field] = e.newValue;
                        setData(updated);
                        db.set(`STORAGES.${dbKey}`, updated);
                    }}
                    body={(rowData, colProps) => {

                        return (
                            <span
                                style={{ cursor: 'pointer', fontSize:'12px' }}
                                onClick={()=> handleClick(col.field, colProps.rowIndex)}
                            >
                                {rowData[col.field]}
                            </span>
                        );
                    }}
                />
            ))}
        </DataTable>
    );
}