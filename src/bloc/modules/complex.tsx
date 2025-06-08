import React from 'react';
import { Accordion, AccordionProps, HoverPopover } from '../../index';
import { icons, iconsList } from '@components/tools/icons';
import { Tabs, Tab, BottomNavigation, BottomNavigationAction, Paper, TabsProps, Typography } from '@mui/material';
import { ComponentProps, DataNested } from '../type';
import { triggerFlyFromComponent } from './helpers/anim';
import { useComponentSizeWithSiblings } from './helpers/hooks';
import { ToggleInput } from '../../index';
import { updateComponentProps } from '../helpers/updateComponentProps';
import render, { exportedTabs, exportedBottomNav } from './export/bloks';
import { DropSlot, ContextSlot } from '../Dragable';
import { editorContext } from "../context";


////////////////////////////////////////////////////////////////////////////////
type BottomNavWrapperProps = {
    'data-id': number
    'data-type': 'BottomNav'
    showLabels: boolean
    style: React.CSSProperties
    fullWidth: boolean
    elevation?: number
    labelSize?: number,
    iconSize?: number,
    color: string,
    colorSelect: string,
    items: {
        id: string
        label?: string
        icon: string
    }[]

}
type AccordionWrapperProps = AccordionProps & ComponentProps & {
    'data-id': number
    'data-type': 'Accordion'
    fullWidth: boolean
    slots: Record<string, DataNested>
    styles: {
        title: React.CSSProperties
        body: React.CSSProperties
    }
}
type TabsWrapperProps = TabsProps & {
    'data-id': number
    'data-type': 'Tabs'
    'select-color': string
    alignTab: 'start' | 'center' | 'end'
    metaName?: string,
    color: string
    isHorizontal: boolean
    items: string[]
    fullWidth?: boolean
    slots: Record<string, DataNested>
}
////////////////////////////////////////////////////////////////////////////////


export const AccordionWrapper = React.forwardRef((props: AccordionWrapperProps, ref) => {
    const { 'data-id': dataId, style, metaName, items, styles, activeIndexs, slots, fullWidth, ...otherProps } = props;
    const { width, height, container } = useComponentSizeWithSiblings(dataId);

    const handleChange = (index: number, data: string) => {
        const copy = JSON.parse(JSON.stringify(items));

        if (copy[index]) {
            copy[index].title = data;

            updateComponentProps({
                component: { props },
                data: { items: copy }
            });
        }
    }
    const parse = () => {
        return items.map((item, index) => {
            const text = item.title?.props?.children ?? item.title;

            const EditComponent = () => (
                <div
                    style={{
                        border: '1px solid transparent',
                        outline: 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={(e) => {
                        e.currentTarget.style.border = '1px solid transparent';
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.padding = '0px';
                        handleChange(index, e.currentTarget.innerText);
                    }}
                    contentEditable={true}
                    suppressContentEditableWarning
                    onFocus={(e) => {
                        e.currentTarget.style.padding = '5px';
                        e.currentTarget.style.borderRadius = '8px';
                        e.currentTarget.style.background = '#0000008';
                        e.currentTarget.style.border = '1px solid #3b8ee2b1';
                    }}
                >
                    { text }
                </div>
            );
            const SlotContent = () => (
                <ContextSlot
                    type='Accordion'
                    idParent={dataId} 
                    idSlot={index}
                    data={{
                        ...slots[index],
                        size: {
                            width: container.width, 
                            height:container.height
                        }
                    }}
                    nestedComponentsList={{
                        Button: true,
                        Typography: true
                    }}
                />
            );

            return ({
                title: EDITOR ? <EditComponent /> : text,
                content: <div style={{minHeight:40}}><SlotContent /></div>,
            });
        });
    }
    const exportCode = (call) => {
        const code = render(
            editorContext.meta.get(),
            activeIndexs,
            styles,
            items,
            slots,
            { ...style, width: '100%', display: 'block' }
        );
        
        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);
    const parsedItems = React.useMemo(() => parse(), [props, width]);

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Accordion'
            style={{ ...style, width: '100%', display: 'block' }}
            {...otherProps}
        >
            <Accordion
                activeIndexs={activeIndexs}
                tabStyle={styles?.body}
                headerStyle={styles?.title}
                items={parsedItems}
            />
        </div>
    );
});
export const TabsWrapper = React.forwardRef((props: TabsWrapperProps, ref) => {
    const [value, setValue] = React.useState(0);
    const { 
        'data-id': dataId, 
        'select-color': selectColor,
        color,
        style, 
        isHorizontal, 
        items, 
        metaName, 
        slots, 
        fullWidth, 
        alignTab,
        ...otherProps 
    } = props;
    const { width, height, container } = useComponentSizeWithSiblings(dataId);


    const exportCode = (call) => {
        const code = exportedTabs(
            editorContext.meta.get(),
            items,
            isHorizontal,
            selectColor,
            color,
            slots,
            { 
                ...style, 
                width: '100%',
                height: height ?? '100%',
                display: 'flex',
                flexDirection: isHorizontal ? 'column' : 'row',
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
                minHeight: 0
            }
        );

        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    const handleChangeEdit = (index: number, data: string) => {
        const copy = JSON.parse(JSON.stringify(items));

        if (items[index]) {
            copy[index] = data;

            updateComponentProps({
                component: { props },
                data: { items: copy }
            });
        }
    }
    const parse = () => {
        if (items) return items.map((item, index) => {
            if(EDITOR) return(
                <span
                    style={{
                        border: '1px solid transparent',
                        outline: 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={(e) => {
                        e.currentTarget.style.border = '1px solid transparent';
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.padding = '0px';
                        handleChangeEdit(index, e.currentTarget.innerText);
                    }}
                    contentEditable={true}
                    suppressContentEditableWarning
                    onFocus={(e) => {
                        e.currentTarget.style.padding = '5px';
                        e.currentTarget.style.borderRadius = '8px';
                        e.currentTarget.style.background = '#0000008';
                        e.currentTarget.style.border = '1px solid #3b8ee2b1';
                    }}
                >
                    { typeof item === 'string' ? item : '' }
                </span>
            );
            else return items;
        });
    }
    const parsedItems = React.useMemo(() => parse(), [items]);
    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Tabs'
            style={{ 
                ...style, 
                width: '100%',
                height: height ?? '100%',
                display: 'flex',
                flexDirection: isHorizontal ? 'column' : 'row',
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
                minHeight: 0,
            }}
            { ...otherProps }
        >
            <Tabs
                value={value}
                onChange={handleChange}
                orientation={isHorizontal ? 'horizontal' : 'vertical'}
                variant={isHorizontal ? "scrollable" : 'standard'}
                scrollButtons="auto"
                allowScrollButtonsMobile={true}
                indicatorColor={'primary'}
                aria-label="tabs"
                sx={{
                    '& .MuiTabs-indicator': {
                        backgroundColor: selectColor
                    },
                }}
            >
                { parsedItems && parsedItems.map((elem, index) =>
                    <Tab
                        sx={{
                            margin: 'auto',
                            //textAlign: 'center',
                            alignItems: alignTab,
                            whiteSpace: 'normal',
                            wordBreak: 'keep-all',
                            overflowWrap: 'break-word',
                            color: color,
                            '&.Mui-selected': {
                                color: selectColor,
                            },
                        }}
                        key={index}
                        label={elem}
                    />
                )}
            </Tabs>
            {/* Слоты */}

            <ContextSlot
                type='Tabs'
                idParent={dataId}
                idSlot={value}
                data={{
                    ...slots[value],
                    size: {
                        width: container.width,
                        height: container.height
                    }
                }}
                nestedComponentsList={{
                    Button: true,
                    Typography: true
                }}
            />
        
        </div>
    );
});


export const BottomNavWrapper = React.forwardRef((props: BottomNavWrapperProps, ref) => {
    const [value, setValue] = React.useState(0);
    const { 
        'data-id': dataId, 
        style, 
        items, 
        fullWidth, 
        showLabels, 
        color,
        labelSize,
        iconSize,
        ...otherProps 
    } = props;
    
    
    const exportCode = (call) => {
        const code = exportedBottomNav(
            items,
            style,
            {
                fontFamily: style?.fontFamily,
                textDecoration: style?.textDecoration,
                textDecorationStyle: style?.textDecorationStyle,
                fontSize: labelSize,
                color: color
            },
            {
                color: color,
                fontSize: iconSize
            },
            showLabels,
            otherProps 
        );

        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    const handleChangeEdit = (index: number, data: {label:string,icon:string,id:string}) => {
        const copy = JSON.parse(JSON.stringify(items));

        if (items[index]) {
            copy[index] = data;

            updateComponentProps({
                component: { props },
                data: { items: copy }
            });
        }
    }
    const labelEditable = (item: {label:string,icon:string,id:string}, index: number) => {
        return (
            <div
                style={{
                    border: '1px solid transparent',
                    outline: 'none',
                }}
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.padding = '0px';
                    handleChangeEdit(index, {
                        ...item,
                        label: e.currentTarget.innerText
                    });
                }}
                contentEditable={true}
                suppressContentEditableWarning
                onFocus={(e) => {
                    e.currentTarget.style.padding = '5px';
                    e.currentTarget.style.borderRadius = '8px';
                    e.currentTarget.style.background = '#0000008';
                    e.currentTarget.style.border = '1px solid #3b8ee2b1';
                }}
            >
                { item.label }
            </div>
        )
    }
    const iconEditable = (item: {label:string,icon:string,id:string}, index: number) => {
        const categorys = Object.keys(icons);

        const resultRender = categorys.map((keyNameCategory)=> {
            const items = Object.keys(icons[keyNameCategory]).map((iconKeyName)=> {
                const Icon = iconsList[iconKeyName];
                
                return {
                    id: iconKeyName,
                    label: Icon ? <Icon style={{ fontSize:14 }}/> : null
                }
            });

            return(
                <div onClick={(e)=> e.stopPropagation()} key={keyNameCategory} style={{display:'flex',flexDirection:'column'}}>
                    <Typography variant='subtitle2' sx={{textDecoration: 'underline',my:1}}>
                        { keyNameCategory }
                    </Typography>
                    <ToggleInput
                        items={items}
                        onChange={(value)=> handleChangeEdit(index, {
                            ...item,
                            icon: value
                        })}
                    />
                </div>
            );
        });

        const Icon = iconsList[item.icon];

        return (
            <HoverPopover 
                content={
                    <div>
                        { resultRender }
                    </div>
                }
            >
                <Icon />
            </HoverPopover>
        )
    }
    const parse = () => {
        if (items) return items.map((item, index) => {
            const Icon = (item.icon && iconsList[item.icon]) ? iconsList[item.icon] : undefined;
            const IconEditable = (item.icon && iconsList[item.icon]) ? iconEditable(item, index) : null;
            const editable = item.label ? labelEditable(item, index) : undefined;
            
            return {
                icon: EDITOR ? IconEditable : (Icon ? <Icon/> : undefined),
                label: EDITOR ? editable : item.label
            }
        });
    }
    const parsedItems = React.useMemo(() => parse(), [items]);
    

    return (
        <Paper
            ref={ref}
            data-id={dataId}
            data-type='BottomNav'
            style={{ 
                width: '100%', 
                position: 'sticky',
                bottom: 0, 
                border: '1px'
            }}
            { ...otherProps }
        >
            <BottomNavigation
                style={{ ...style }}
                showLabels={showLabels}
                value={value}
                onChange={handleChange}
            >
                {parsedItems && parsedItems.map((elem, index) =>
                    <BottomNavigationAction
                        key={index}
                        label={ showLabels && 
                            <span style={{
                                fontFamily: style?.fontFamily,
                                textDecoration: style?.textDecoration,
                                textDecorationStyle: style?.textDecorationStyle,
                                fontSize: labelSize
                            }}>
                                { elem.label }
                            </span>
                        }
                        icon={elem.icon ? elem.icon : undefined}
                        sx={{
                            '& .MuiSvgIcon-root': {
                                fontSize: iconSize,
                                color: color
                            },
                        }}
                    />
                )}
            </BottomNavigation>
        </Paper>
    );
});