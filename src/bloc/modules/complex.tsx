import React from 'react';
import { Accordion, AccordionProps } from '../../index';
import { Box, Tabs, Tab, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { ComponentProps } from '../type';
import { deserializeJSX } from '../utils/sanitize';
import { triggerFlyFromComponent } from './utils/anim';
import { useEvent, useCtxBufer } from './utils/shared';
import { iconsList } from '../../components/tools/icons';
import DataTable, { DataSourceTableProps }  from './sources/table';
import { useComponentSizeWithSiblings } from './utils/hooks';
import render from './export/Acordeon';

type AccordionWrapperProps = AccordionProps & ComponentProps;
type TableSourcesProps = DataSourceTableProps & ComponentProps;


export const AccordionWrapper = React.forwardRef((props: AccordionWrapperProps, ref) => {
    const { ['data-id']: dataId, style, items, tabStyle, activeIndexs, fullWidth, ...otherProps } = props;
    
    // добавить элементы
    const parse =()=> {
        const maps = {
            Box: Box
        }

        return items.map((item) => ({
            title: deserializeJSX(item.title, maps),
            content: deserializeJSX(item.content, maps),
        }));
    }
    const parsedItems = React.useMemo(() => parse(), [items]);
    const degidratation = () => {
        return render(
            activeIndexs,
            tabStyle,
            parsedItems,
            { ...style, width: '100%', display: 'block' }
        );
    }

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Accordion'
            style={{ ...style, width: '100%', display: 'block' }}
            { ...otherProps }
        >
            <Accordion
                activeIndexs={activeIndexs}
                tabStyle={tabStyle}
                items={parsedItems}
            />
        </div>
    );
});

export const TabsWrapper = React.forwardRef((props: any, ref) => {
    const [value, setValue] = React.useState(0);
    const { ['data-id']: dataId, style, items, fullWidth, textColor, indicatorColor, ...otherProps } = props;
    

    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, value), [dataId]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        emiter('onChange', newValue);
        storage(newValue);
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    // добавить элементы
    const parse =()=> {
        const maps = {
            Box: Box
        }

        if(items) return items.map((item) => deserializeJSX(item));
    }
    const parsedItems = React.useMemo(() => parse(), [items]);
    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Tabs'
            style={{ ...style, width: '100%', display: 'block' }}
            { ...otherProps }
        >
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile={true}
                textColor={textColor}
                indicatorColor={indicatorColor}
                aria-label="tabs"
            >
                { parsedItems && parsedItems.map((elem, index)=>
                    <Tab
                        key={index}
                        label={elem}
                    />
                )}
            </Tabs>
        </div>
    );
});

// сделать зпкреп снизу, сделать маршрутизацию
// * обеспечивает внутреннюю навигацию
export const BottomNavWrapper = React.forwardRef((props: any, ref) => {
    const [value, setValue] = React.useState(0);
    const { ['data-id']: dataId, style, items, fullWidth, textColor, indicatorColor, ...otherProps } = props;
    

    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, value), [dataId]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        emiter('onChange', newValue);
        storage(newValue);
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    const parse =()=> {
        if(items) return items.map((item) => {
                const label =  deserializeJSX(item.label);
                const Icon = item.icon && iconsList[item.icon] ? iconsList[item.icon] : null;

                return {
                    label: label,
                    icon: Icon
                }
            }
        );
    }
    const parsedItems = React.useMemo(() => parse(), [items]);


    return (
        <Paper
            ref={ref}
            data-id={dataId}
            data-type='BottomNav'
            style={{ ...style, width: '100%', position:'sticky'}}
            { ...otherProps }
        >
            <BottomNavigation 
                value={value} 
                onChange={handleChange}
            >
                { parsedItems && parsedItems.map((elem, index)=>
                    <BottomNavigationAction
                        key={index}
                        label={elem.label}
                        icon={elem.icon ? <elem.icon/> : undefined}
                    />
                )}
            </BottomNavigation>
        </Paper>
    );
});

// пока только текстовые данные. Надо стили
export const DataTableWrapper = React.forwardRef((props: TableSourcesProps, ref) => {
    const { 
        ['data-id']: dataId, 
        style, 
        header,
        footer,
        ...otherProps 
    } = props;
    

    const { width, height } = useComponentSizeWithSiblings(dataId);
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    //const storage = React.useMemo(() => useCtxBufer(dataId, value), [dataId]);
    //const parsedItems = React.useMemo(() => deserializeJSX(children), [children]);
    

    return (
        <DataTable
            height={height}
            width={width}
            dataId={dataId}
            onSelect={(data)=> {
                emiter('onSelect', data);
                triggerFlyFromComponent(String(dataId));
            }}
            { ...otherProps }
       />
    );
});