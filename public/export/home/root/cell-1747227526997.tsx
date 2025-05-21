import { DataTable } from '@lib/index';
import { Column } from 'primereact/column';
import styled, { css } from 'styled-components';
import React from 'react';

export function DataTableWrap() {
    const data = [
        { test: 1, name: 'никалай' },
        { test: 3, name: 'степан' },
        { test: 5, name: 'олег' },
        { test: 3, name: 'гриша' },
        { test: 5, name: 'вася' }
    ];

    return (
        <div style={{ display: 'block', width: '100%' }}>
            <DataTable
                style={{ display: 'block', width: '100%' }}
                styles={{}}
                value={data ?? []}
                fontSizeHead={'14px'}
                emptyMessage="empty data"
                footer={undefined}
                data-source="table"
                refreshInterval={25000}
                data-type="DataTable"
            >
                <Column
                    sortable
                    key={'test'}
                    field={'test'}
                    header={
                        <div
                            style={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                textAlign: 'center'
                            }}
                        >
                            test
                        </div>
                    }
                    body={(rowData, colProps) => (
                        <span
                            style={{ cursor: 'pointer', fontSize: '12px' }}
                            //onClick={()=> handleClick(col.field, colProps.rowIndex)}
                        >
                            {rowData['test']}
                        </span>
                    )}
                />

                <Column
                    sortable
                    key={'name'}
                    field={'name'}
                    header={
                        <div
                            style={{
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                textAlign: 'center'
                            }}
                        >
                            name
                        </div>
                    }
                    body={(rowData, colProps) => (
                        <span
                            style={{ cursor: 'pointer', fontSize: '12px' }}
                            //onClick={()=> handleClick(col.field, colProps.rowIndex)}
                        >
                            {rowData['name']}
                        </span>
                    )}
                />
            </DataTable>
        </div>
    );
}

export default function Cell() {
    return (
        <>
            <DataTableWrap />
        </>
    );
}
