import React, { useRef, useState, useEffect, ComponentProps } from 'react';
import { alpha, darken, Theme } from "@mui/material/styles";
import { DataTable, DataTableValueArray } from "primereact/datatable";
import styled from 'styled-components';
import { useTheme } from '@mui/material';


export type DataTablePropsWrapper = ComponentProps<typeof DataTable>;
// todo: стилизировать через тему
const StyledTableWrapper = styled.div<{ theme: Theme }>`
    height: 100%;
    display: flex;
    flex-direction: column;

    // прокрутка
    ::-webkit-scrollbar-track {
        background-color:#2a2a2b85;
    }
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 3px;
        border-radius: 3px;
        background-color:#dedfdf;
        border: #333 1px solid;
    }
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background-color:#adadad;
    }
    ::-webkit-scrollbar {
        width: 7px;
    }


    .p-datatable {
        background: ${({ theme })=> theme.palette.table.body};
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        border: 1px solid;
        border-color: ${({ theme })=> theme.palette.card.border };
        width: 100%;
    }
    .p-datatable-header {
        background: ${({ theme })=> alpha(theme.palette.table.header, 0.1)};
        border-bottom: 1px solid #5f5f5f35;
        color: ${({ theme })=> theme.palette.text.primary};
        font-size: 18px;
        font-weight: bold;
        padding: 12px 16px;
    }
    .p-datatable-footer {
        border-top: 1px solid;
        border-color: ${({ theme })=> alpha(theme.palette.action.active, 0.1)};
        background: ${({ theme })=> alpha(theme.palette.table.header, 0.1)};
        color: ${({ theme })=> theme.palette.text.primary};
        font-size: 16px;
        padding: 12px 16px;
    }
    // панель фильтры и сортировка
    .p-datatable-thead > tr > th {
        background: ${({ theme })=> theme.palette.table.thead};
        color: ${({ theme })=> theme.palette.grey[500]};
        font-weight: bold;
        padding: 1.5%;
        text-align: left;
        box-shadow: 0 4px 3px rgba(0, 0, 0, 0.08) inset, 0 3px 4px rgba(0, 0, 0, 0.06);
        backdrop-filter: blur(10px);
        font-size:  14px;
        white-space: nowrap;
    }
    // нечетные row 
    .p-datatable-tbody > tr:nth-child(even) {
        //background: ${({ theme })=> theme.palette.background.card};
    }
    // стили row текста 
    .p-datatable-tbody > tr {
        color: ${({ theme })=> theme.palette.text.primary};
        font-size: 16px;
        transition: background 0.2s ease-in-out;
    }
    // при наведении на row
    .p-datatable-tbody > tr:hover {
        background: #3a3c52;
        cursor: pointer;
    }
    // границы row
    .p-datatable-tbody > tr > td {
        padding: 12px;
        border-bottom: 1px dashed ${({ theme })=> theme.palette.card.border};
    }
    .p-datatable-tbody > tr.p-highlight {
        background: #574b90 !important;
    }
`;



/**
 * 🎁 Декоратор над PrimeReact `<DataTable>`:           
 * добавляет автоматическую подстройку высоты контейнера,       
 * сохраняя оригинальное API компонента.
 */
export default function({ value, children, header, footer, ...props }: DataTablePropsWrapper) {
    const theme = useTheme();
    const tableRef = useRef<DataTable<DataTableValueArray>>(null);
    const [scrollHeight, setScrollHeight] = useState<string>();
    const [height, setHeight] = useState<number>();
    
    
    const getPadding =(element: Element)=> {
        const style = getComputedStyle(element);
        const padding = parseFloat(style.paddingBottom);

        return padding;
    }
    const getBound =(element: Element)=> {
        const parent = element.parentElement;     // родитель
        const bound = element.getBoundingClientRect();
        const boundParent = parent.getBoundingClientRect();
        
        const maxHeight = window.innerHeight - bound.y;
        const padding = getPadding(parent) * 2;
        //console.log(window.innerHeight, boundParent.height)

        if(window.innerHeight <= boundParent.height) {
            parent.style.height = maxHeight + 'px';
            
            return maxHeight - padding;
        }
        else {
            return boundParent.height - padding;
        }
    }
    useEffect(()=> {
        const updateHeight =()=> {
            if(tableRef.current) {
                const container = tableRef.current.getElement();
                const bodyArea = tableRef.current.getTable().parentElement;
                const parent = container.parentElement;     // родитель
                
                const headerElement = container.querySelector('.p-datatable-header');
                const footerElement = container.querySelector('.p-datatable-footer');

                //const parentHeight = parent.offsetHeight || 0;
                const containerHeight = container?.offsetHeight || 0;
                const headerHeight = headerElement?.offsetHeight || 0;
                const footerHeight = footerElement?.offsetHeight || 0;
                //console.log(parentHeight);

                // Вычисляем высоту прокручиваемой области
                const calculatedScrollHeight = containerHeight - headerHeight - footerHeight;
                
                setScrollHeight(`${Math.max(calculatedScrollHeight, 50)}px`);
                //console.log(getBound(container))
                setHeight(getBound(container));
            }
        };

        const resizeObserver = new ResizeObserver(updateHeight);
        if(tableRef.current) {
            const container = tableRef.current?.getElement();
            resizeObserver.observe(container);
        }

        return ()=> {
            resizeObserver.disconnect();
        }
    }, [header, footer, value]);
    
    
    return (
        <StyledTableWrapper theme={theme}>
            <DataTable
                ref={tableRef}
                value={value}
                scrollable={true}
                scrollHeight={scrollHeight}
                style={{ height: '100%', flexGrow: 1, maxHeight: `${height}px` }}
                header={header}
                footer={footer}
                {...props}
            >
                { children }
            </DataTable>
        </StyledTableWrapper>
    );
}