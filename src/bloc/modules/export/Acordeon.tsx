import { jsxJsonToString, formatJsx, renderJsonToLiteral, renderComponentSsr, renderComponentSsrPrerender } from './utils';
import { Component, ComponentProps } from '../../type';
import { splitImportsAndBody, getComponentLiteral, mergeImports } from './Grid';


export function toJSXProps(obj: Record<string, any>): string {
    return Object.entries(obj || {})
        .map(([key, value]) => {
            if (typeof value === 'string') {
                return `${key}="${value}"`; // строки — в кавычки
            } 
            else if (typeof value === 'boolean') {
                return value ? key : ''; // disabled={false} → пропуск
            } 
            else {
                return `${key}={${JSON.stringify(value)}}`; // всё остальное — через {}
            }
        })
        .filter(Boolean)
        .join(' ');
}


export default function exported(
    activeIndexs: number[],
    styles: {title: React.CSSProperties, body: React.CSSProperties},
    items: {
        /** label аккордеона */
        title: React.ReactNode
        /** тело аккордеона */
        content: React.ReactNode
    }[],
    style: React.CSSProperties
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
    const jsxItems = items.map(({ title, content }) => {
            const titleStr = typeof title === 'string'
                ? JSON.stringify(title)
                : jsxJsonToString(title);

            const contentStr = typeof content === 'string'
                ? JSON.stringify(content)
                : jsxJsonToString(content);

        return `{
            title: ${titleStr},
            content: ${contentStr}
        }`;
    });
    
    
    return (`
        import React from 'react';
        import { Chip, Box, Button } from '@mui/material';
        import { Accordion } from '@lib/index';
        

        export default function AcordionWrap() {

            return (
                <div
                    style={{ ${toObjectLiteral(style)} }}
                >
                    <Accordion
                        activeIndexs={[${(activeIndexs??[]).toString()}]}
                        tabStyle={{ ${toObjectLiteral(styles?.body)} }}
                        headerStyle={{ ${toObjectLiteral(styles?.title)} }}
                        items={[
                            ${jsxItems.join(',\n')}
                        ]}
                    />
                </div>
            );
        }
    `);
}
export function exportedTabs(
    items: string[],
    textColor: "inherit" | "secondary" | "primary" | undefined,
    slots: [Component[]]
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
    const renderTab =()=> {
        return items ? items.map((elem, index) => (`
            <Tab
                key={${index}}
                label={"${elem}"}
            />
        `)) : [''];
    }
    const renderSlots =()=> {
        const dslots = {};
        const imports = [];


        Object.values(slots).map((slot, index) => {
            dslots[index] = [];


            slot.map(elem => {
                const id = elem.props['data-id'];

                sharedEmmiter.emit('degidratation.' + id, {
                    call: (code: string) => {
                        const data = splitImportsAndBody(code);
                        imports.push(...data.imports);
                        dslots[index].push(getComponentLiteral(data.body));
                    }
                });
            })
        })
        

        const slotLiteralEntries = Object.entries(dslots).map(([key, bodys]) => {
            const jsx = bodys.length > 0 ? `<>${bodys.join('\n\n')}</>` : `<></>`;
            return `"${key}": ${jsx}`;
        });

        const slotsLiteral = `{\n${slotLiteralEntries.join(',\n')}\n}`;

        return {
            slots: slotsLiteral,
            imports: mergeImports(imports).join('\n')
        }
    }

    const result = renderSlots();
    

    return (`
        import React from 'react';
        import { Tabs, Tab } from '@mui/material';
        ${result.imports}

        export default function TabNavigation() {
            const [curent, setCurent] = React.useState(0);
            const slots = ${result.slots}

            return (
                <div
                    style={{ width: '100%', display: 'block' }}
                >
                    <Tabs
                        value={curent}
                        onChange={(event: React.SyntheticEvent, newValue: number) => {
                            setCurent(newValue);
                        }}
                        variant="scrollable"
                        scrollButtons={true}
                        allowScrollButtonsMobile={true}
                        textColor={ ${JSON.stringify(textColor)} }
                        aria-label="tabs"
                    >
                        ${renderTab().join('\n')}
                    </Tabs>
                    <div style={{ height: 'fit-content' }}>
                        { slots[curent] }
                    </div>
                </div>
            );
        }
    `);
}
// individual
export function exportedBottomNav(
    items: {label:string, icon:string,id?:string}[],
    style: React.CSSProperties,
    labelStyle: React.CSSProperties,
    iconStyle: React.CSSProperties,
    showLabels: boolean,
    otherProps: any
) {
    const iconsName = []; 
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
    const renderItemsLiteral = () => {
        return `[\n${items.map((item, index) => (
            `  { id: '${item.id ?? 'BottomNavigation-'+index}', icon: <${item.icon} />, label: '${item.label}' }`
        )).join(',\n')}\n]`;
    }
    

    return (`
        import React from 'react';
        import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
        import { ${items.map((elem, index)=> elem.icon).join(', ')} } from '@mui/icons-material';
       

        export default function BottomNavigationWrap() {
            const [curent, setCurent] = React.useState(0);
            const items = ${renderItemsLiteral()};

            const handleChange = (e: React.SyntheticEvent, newValue: number) => {
                setCurent(newValue);
            }

            return (
                <Paper
                    style={{
                        width: '100%', 
                        position: 'sticky',
                        bottom: 0, 
                        border: '1px'
                    }}
                    ${ toJSXProps(otherProps) }
                >
                    <BottomNavigation
                        style={{ ${toObjectLiteral(style)} }}
                        showLabels={${JSON.stringify(showLabels)}}
                        value={curent}
                        onChange={handleChange}
                    >
                        { items && items.map((elem, index: number) =>
                            <BottomNavigationAction
                                key={index}
                                label={ ${JSON.stringify(showLabels)} && 
                                    <span style={{ ${toObjectLiteral(labelStyle)} }}>
                                        { elem.label }
                                    </span>
                                }
                                icon={elem.icon ? elem.icon : undefined}
                                sx={{ 
                                    '& .MuiSvgIcon-root': {
                                        ${toObjectLiteral(iconStyle)}
                                    } 
                                    }}
                            />
                        )}
                    </BottomNavigation>
                </Paper>
            );
        }
    `);
}

export function exportedTable(
    data: {[key:string]: any}[],
    columns: {field: string}[],
    fontSizeHead: string,
    style: React.CSSProperties,
    styles: {},
    otherProps: any
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
    const renderColumnsLiteral = () => {
        return `\n${columns.map((col, index) => (
            `<Column 
                    sortable
                    key={"${col.field}"} 
                    field={"${col.field}"} 
                    header={
                        <div 
                            style={{ 
                                whiteSpace: 'normal',
                                wordBreak: 'break-word', 
                                textAlign: 'center' 
                            }}
                        >
                            ${col.field}
                        </div>
                    }
                    body={(rowData, colProps) => 
                        <span
                            style={{ cursor: 'pointer', fontSize:'12px' }}
                            //onClick={()=> handleClick(col.field, colProps.rowIndex)}
                        >
                            { rowData["${col.field}"] }
                        </span>
                    }
                />
            `
        )).join(',\n')}\n`;
    }
    const renderDataLiteral = () => {
        return `[\n${data.map((item, index) => (
            `{ ${toObjectLiteral(item)}  }`
        )).join(',\n')}\n]`;
    }


    return (`
        import React from 'react';
        import { DataTable } from '@lib/index';
        import { Column } from 'primereact/column';
        import styled, { css } from 'styled-components';

        

        export default function DataTableWrap() {
            const data = ${renderDataLiteral};


            return (
                <DataTable
                    style={{ ${toObjectLiteral(style)} }}
                    styles={{ ${toObjectLiteral(styles)} }}
                    value={data}
                    fontSizeHead={"${fontSizeHead ?? '14px'}"}
                    emptyMessage='empty data'
                    footer={ undefined }
                    ${ toJSXProps(otherProps) }
                >
                    ${ renderColumnsLiteral() }
                </DataTable>
            );
        }
    `);
}