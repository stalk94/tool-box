import React from 'react';
import { LayoutCustom, DataNested, Structur } from '../../type';
import { exportLiteralToFile } from "../../helpers/export";
import { useRenderNestedContext, dedupeImports } from './_core';
import { toObjectLiteral } from './utils';



const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
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
    meta: { scope: string, name: string },
    activeIndexs: number[],
    styles: {title: React.CSSProperties, body: React.CSSProperties},
    items: {
        /** label аккордеона */
        title: React.ReactNode
        /** тело аккордеона */
        content: React.ReactNode
    }[],
    slots: Record<string, DataNested>,
    style: React.CSSProperties
) {
    const renderSlotsLinks =()=> {
        const result = {
            imports: [],
            bodys: []
        }

        Object.values(slots).map((data, idSlot)=> {
            if(data.layout) {
                const name = `SlotGrid_${idSlot}`;
                result.bodys.push(`<${name} />`);
                result.imports.push(`import ${name} from './acordeonSlots/${name}';`);
            }
            else {
                result.bodys.push(`<div>not content</div>`);
            }
        });

        return {
            body: `[\n${result.bodys.join(',\n')}\n];`,
            imports: `${result.imports.join('\n')}`
        }
    }
    // acordeonSlots/SlotGrid_0
    const renderSlots = async()=> {
        const ls = Object.values(slots).map(data => ({
            size: data.size,
            layout: data.layout
        }));
        
        ls.map(async(elem, index)=> {
            if(elem.layout) {
                exportLiteralToFile(
                    [meta.scope, `${meta.name}/acordeonSlots`], 
                    `SlotGrid_${index}`,
                    await useRenderNestedContext(elem.layout, elem.size, 'Acordeon')
                );
            }
        });
    }
    const render =()=> {
        const ls = Object.values(slots).map(data => ({
            size: data.size,
            layout: data.layout
        }));

        return items.map(({ title, content }, index) => {
            const slotData = ls[index]?.layout;
            const titleStr = typeof title === 'string'
                ? JSON.stringify(title)
                : title.props.children;

            return `{
                title: ${titleStr},
                content: ${slotData ? `<SlotGrid_${index}/>` : `<div>not content</div>`}
            }`;
        });
    }

    const prerender = renderSlotsLinks();
    renderSlots()
    

    return (`
        import React from 'react';
        import { Chip, Box, Button } from '@mui/material';
        import { Accordion } from '@lib/index';
        ${prerender.imports}
        

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
                            ${render().join(',\n')}
                        ]}
                    />
                </div>
            );
        }
    `);
}
export function exportedTabs(
    meta: { scope: string, name: string },
    items: string[],
    isHorizontal: boolean,
    selectColor: string,
    color: string,
    slots: Record<string, DataNested>,
    style: React.CSSProperties
) {
    const renderTab =()=> {
        return items ? items.map((elem, index) => (`
            <Tab
                sx={{
                    color: ${color},
                    '&.Mui-selected': {
                        color: ${selectColor},
                    }
                }}
                key={${index}}
                label={"${elem}"}
            />
        `)) : [''];
    }
    const renderSlotsLinks =()=> {
        const result = {
            imports: [],
            bodys: []
        }

        Object.values(slots).map((data, idSlot)=> {
            if(data.layout) {
                const name = items[idSlot] ? capitalizeFirst(items[idSlot]) : `TabsSlotGrid_${idSlot}`;
                
                result.bodys.push(`<${name} />`);
                result.imports.push(`import ${name} from './tabsSlots/${name}';`);
            }
            else {
                result.bodys.push(`<div>not content</div>`);
            }
        });

        return {
            body: `[\n${result.bodys.join(',\n')}\n];`,
            imports: `${result.imports.join('\n')}`
        }
    }
    const colorSelect = (
        selectColor ? `sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: ${selectColor}
                            },
                        }}` 
                    : ''
    );
    // tabsSlots/TabsSlotGrid_0
    const renderSlots = async()=> {
        const ls = Object.values(slots).map(data=> ({
            size: data.size,
            layout: data.layout
        }));
        
        ls.map(async(elem, index)=> {
            if(elem.layout) {
                const name = items[index] ? capitalizeFirst(items[index]) : `TabsSlotGrid_${index}`

                exportLiteralToFile(
                    [meta.scope, `${meta.name}/tabsSlots`], 
                    name,
                    await useRenderNestedContext(elem.layout, elem.size, 'Tabs')
                );
            }
        });
    }

    const prerender = renderSlotsLinks();
    renderSlots();
    

    return (`
        import React from 'react';
        import { Tabs, Tab } from '@mui/material';
        ${prerender.imports}
        

        export default function TabNavigation() {
            const [curent, setCurent] = React.useState(0);
            const slots = ${prerender.body}

            return (
                <div
                    style={{ ${toObjectLiteral(style)} }}
                >
                    <Tabs
                        value={curent}
                        onChange={(event: React.SyntheticEvent, newValue: number) => {
                            setCurent(newValue);
                        }}
                        orientation={${isHorizontal ? 'horizontal' : 'vertical'}}
                        variant="scrollable"
                        scrollButtons={true}
                        allowScrollButtonsMobile={true}
                        aria-label="tabs"
                        ${colorSelect}
                    >
                        ${renderTab().join('\n')}
                    </Tabs>
                    <div>
                        { slots[curent] }
                    </div>
                </div>
            );
        }
    `);
}
export function exportedFrame(
    meta: { scope: string, name: string },
    slot: DataNested,
    metaName?: string
) {
    const renderSlotsLinks =(name: string)=> {
        return {
            body: `<${name} />`,
            imports: `import ${name} from './frames/${name}';`
        }
    }
    const renderSlot = async(name: string)=> {
        exportLiteralToFile(
            [meta.scope, `${meta.name}/frames`],
            name,
            await useRenderNestedContext(slot.layout, slot.size, 'Frame')
        );
    }
    const prerender = renderSlotsLinks(metaName??'StackGrid');
    renderSlot(metaName??'StackGrid');


    return (`
        import React from 'react';
        ${prerender.imports}
        

        export default function Frame() {

            return (
                <div
                    style={{ width: '100%', display: 'block' }}
                >
                    ${prerender.body}
                </div>
            );
        }
    `);
}
export function exportedArea(
    meta: { scope: string, name: string },
    slot: DataNested,
    metaName?: string
) {
    const renderSlotsLinks =(name: string)=> {
        return {
            body: `<${name} />`,
            imports: `import ${name} from './canvas/${name}';`
        }
    }
    const renderSlot = async(name: string)=> {
        const { allComponents, allImports, jsxByCell }: Structur = await useRenderNestedContext(slot.layout, slot.size, 'Area');

        exportLiteralToFile(
            [meta.scope, `${meta.name}/canvas`],
            name, 
            (`
                ${ dedupeImports([...allImports]).join('\n') }

                ${allComponents.join('\n\n')}

                export default function AreaCanvas() {
                    return(<>${jsxByCell[slot.layout[0].i]}</>)
                }
            `)
        );
    }
    const prerender = renderSlotsLinks(metaName??'Canvas');
    renderSlot(metaName??'Canvas');

    
    return (`
        import React from 'react';
        ${prerender.imports}
        

        export default function CanvasArea() {

            return (
                <div
                    style={{
                        width: ${slot.size.width - 5}, 
                        height: ${slot.size.height - 5}, 
                        position: 'relative' 
                    }}
                >
                    ${prerender.body}
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
        )).join('\n')}\n`;
    }
    const renderDataLiteral = () => `[\n${data.map(item => `  { ${toObjectLiteral(item)} }`).join(',\n')}\n]`;


    return (`
        import React from 'react';
        import { DataTable } from '@lib/index';
        import { Column } from 'primereact/column';
        import styled, { css } from 'styled-components';

        
        export default function DataTableWrap() {
            const data = ${renderDataLiteral()};


            return (
                <div style={{ ${toObjectLiteral(style)} }}>
                    <DataTable
                        style={{ ${toObjectLiteral(style)} }}
                        styles={{ ${toObjectLiteral(styles)} }}
                        value={data ?? []}
                        fontSizeHead={"${fontSizeHead ?? '14px'}"}
                        emptyMessage='empty data'
                        footer={ undefined }
                        ${ toJSXProps(otherProps) }
                    >
                        ${ renderColumnsLiteral() }
                    </DataTable>
                </div>
            );
        }
    `);
}