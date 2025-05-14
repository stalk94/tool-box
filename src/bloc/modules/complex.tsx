import React from 'react';
import { Accordion, AccordionProps } from '../../index';
import { Box, Tabs, Tab, BottomNavigation, BottomNavigationAction, Paper, TabsProps } from '@mui/material';
import { Component, ComponentProps } from '../type';
import { deserializeJSX, desserealize } from '../utils/sanitize';
import { triggerFlyFromComponent } from './utils/anim';
import { useEvent, useCtxBufer } from './utils/shared';
import { iconsList } from '../../components/tools/icons';
import DataTable, { DataSourceTableProps } from './sources/table';
import { useComponentSizeWithSiblings } from './utils/hooks';
import { AppBar, Start, LinearNavigation, MobailBurger, Breadcrumbs, BreadcrumbsProps } from '../../index';
import { updateComponentProps } from '../utils/updateComponentProps';
import { uploadFile } from 'src/app/plugins';
import render, { exportedTabs } from './export/Acordeon';
import renderAppBar, { exportBreadCrumbs } from './export/AppBar';
import { DropSlot } from '../Dragable';



type AccordionWrapperProps = AccordionProps & ComponentProps & {
    styles: {
        title: React.CSSProperties,
        body: React.CSSProperties
    }
}
type TabsWrapperProps = TabsProps & {
    items: string[]
    fullWidth?: boolean
    'data-id': number | string
    slots: [Component[]]
}
type TableSourcesProps = DataSourceTableProps & ComponentProps;
type HeaderWrapperProps = {
    'data-id': string | number
    /** стиль базового блока AppBar */
    style: React.CSSProperties
    /** стили слотов: leftLogo, LinearNavigation */
    styles: {
        logo: React.CSSProperties
        navigation: React.CSSProperties
    }
    slots: {

    }
    logo: string
    file: string
    linkItems: []
    elevation: number
}


export const AccordionWrapper = React.forwardRef((props: AccordionWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const { 'data-id': dataId, style, items, styles, activeIndexs, fullWidth, ...otherProps } = props;

    const handleChange = (index: number, data: string) => {
        if (items[index]) {
            items[index].title = data;

            updateComponentProps({
                component: props,
                data: { items: [...items] }
            });
        }
    }
    const parse = () => {
        const maps = {
            Box: Box
        }

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
                    {text}
                </div>
            );

            return ({
                title: <EditComponent />,
                content: deserializeJSX(item.content, maps),
            })
        });
    }
    const parsedItems = React.useMemo(() => parse(), [items]);

    degidratationRef.current = (call) => {
        const code = render(
            activeIndexs,
            styles,
            items,
            { ...style, width: '100%', display: 'block' }
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);


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
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const { 'data-id': dataId, style, items, slots, fullWidth, textColor, ...otherProps } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, value), [dataId]);

    degidratationRef.current = (call) => {
        const code = exportedTabs(
            items,
            textColor,
            slots
        );

        console.log(code)
        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        emiter('onChange', newValue);
        storage(newValue);
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    const handleChangeEdit = (index: number, data: string) => {
        if (items[index]) {
            items[index] = data;

            updateComponentProps({
                component: props,
                data: { items: [...items] }
            });
        }
    }
    const handleAddComponentToSlot = (component: Component) => {
        const updatedSlots = {...slots}; // копируем массив

        if (!updatedSlots[value]) updatedSlots[value] = [component];
        else updatedSlots[value] = [...updatedSlots[value], component];
        
        updateComponentProps({
            component: { props },
            data: { slots: updatedSlots },
        });
        
    }
    const parse = () => {
        if (items) return items.map((item, index) => {
            return(
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
                </div>
            );
        });
    }
    const parsedItems = React.useMemo(() => parse(), [items]);


    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Tabs'
            style={{ ...style, width: '100%', display: 'block', height: '100%' }}
            {...otherProps}
        >
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile={true}
                textColor={textColor}
                indicatorColor={'primary'}
                aria-label="tabs"
            >
                { parsedItems && parsedItems.map((elem, index) =>
                    <Tab
                        key={index}
                        label={elem}
                    />
                )}
            </Tabs>
            <DropSlot 
                id={dataId} 
                dataTypesAccepts={['Text', 'Button']}
                onAdd={handleAddComponentToSlot}
            >
                <div style={{ height:'100%' }}>
                    { slots[value] && 
                        slots[value].map((elem, index)=>
                            <span key={index}>
                                { desserealize(elem) }
                            </span>
                    )}
                </div>
            </DropSlot>
        </div>
    );
});
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
    const parse = () => {
        if (items) return items.map((item) => {
            const label = deserializeJSX(item.label);
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
            style={{ ...style, width: '100%', position: 'sticky' }}
            {...otherProps}
        >
            <BottomNavigation
                value={value}
                onChange={handleChange}
            >
                {parsedItems && parsedItems.map((elem, index) =>
                    <BottomNavigationAction
                        key={index}
                        label={elem.label}
                        icon={elem.icon ? <elem.icon /> : undefined}
                    />
                )}
            </BottomNavigation>
        </Paper>
    );
});
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
            onSelect={(data) => {
                emiter('onSelect', data);
                triggerFlyFromComponent(String(dataId));
            }}
            {...otherProps}
        />
    );
});



export const HeaderWrapper = React.forwardRef((props: HeaderWrapperProps, ref) => {
    const [src, setSrc] = React.useState("");
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const lastFileRef = React.useRef<number | null>(null);
    const {
        ['data-id']: dataId,
        style,
        styles,
        logo,
        file,
        linkItems,
        elevation,
        slots,
        ...otherProps
    } = props;
    const { height } = useComponentSizeWithSiblings(dataId);


    degidratationRef.current = (call) => {
        const code = renderAppBar(
            src,
            style,
            elevation,
            height,
            {
                logo: {
                    maxHeight: '40px',
                    padding: '5px',
                    objectFit: 'contain',
                    borderRadius: '3px',
                    ...styles?.logo
                },
                navigation: { ...styles?.navigation }
            }
        );

        call(code);
    };
    const handlerClickNavigation = (path: 'string') => {
        console.log(path);
    }
    const transformUseRouter = () => {
        const func = (items, parent?: string) => {
            return items.map((elem, index) => {
                if (!parent) elem.path = '/' + elem.id;
                else elem.path = parent + '/' + elem.id;

                elem.comand = () => handlerClickNavigation(elem.path);

                if (elem.children) {
                    func(elem.children, elem.path);
                }

                return elem;
            });
        }

        const result = func(linkItems ?? []);
        return result;
    }
    const handleUpload = async (file) => {
        setSrc('https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif');
        const filename = `img-${componentId}.${file.name.split('.').pop()}`;
        const url = await uploadFile(file, filename);


        setSrc(`${url}?v=${Date.now()}`);
        updateComponentProps({
            component: { props },
            data: { src: `${url}?${Date.now()}` }
        });
    }
    React.useEffect(() => {
        if (file instanceof File) {
            const id = file.lastModified;

            if (id !== lastFileRef.current) {
                lastFileRef.current = id;
                handleUpload(file);
            }
        }
    }, [file]);
    React.useEffect(() => {
        if (!logo || logo.length === 0) {
            setSrc("https://arenadata.tech/wp-content/uploads/2024/10/logo-white-short.png");
        }
        else setSrc(logo);
    }, [logo]);
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);


    return (
        <AppBar
            data-id={dataId}
            data-type='AppBar'
            style={{ ...style }}
            elevation={elevation ?? 1}
            height={height - 5}
            start={
                <Start>
                    <Box
                        component="img"
                        src={src}
                        alt="Logo"
                        sx={{
                            maxHeight: '40px',
                            padding: '5px',
                            objectFit: 'contain',
                            borderRadius: '3px',
                            ...styles?.logo
                        }}
                    />
                </Start>
            }
            center={
                <LinearNavigation
                    sx={{
                        justifyContent: 'flex-start',
                        mr: 2,
                        ...styles?.navigation
                    }}
                    items={transformUseRouter()}
                />
            }
            end={
                <React.Fragment>
                    <MobailBurger
                        items={transformUseRouter()}
                    />

                </React.Fragment>
            }
        />
    );
});

export const BreadcrumbsWrapper = React.forwardRef((props: any, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const [linkStyleState, setState] = React.useState({});
    const {
        'data-id': dataId,
        style,
        pathname,
        separator,
        nameMap,
        fullWidth,
        ...otherProps
    } = props;


    degidratationRef.current = (call) => {
        const code = exportBreadCrumbs(
            separator,
            linkStyleState,
            { ...style, width: '100%', display: 'block' }
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);
    React.useEffect(() => {
        setState({
            fontFamily: style?.fontFamily,
            fontSize: style?.fontSize,
            fontWeight: style?.fontWeight,
            fontStyle: style?.fontStyle,
            textDecoration: style?.textDecoration,
            textDecorationStyle: style?.textDecorationStyle,
        });

    }, [style]);



    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Breadcrumbs'
            style={{
                width: '100%',
                display: 'block',
                marginLeft: style.marginLeft,
                marginTop: style.marginTop
            }}
            {...otherProps}
        >
            <Breadcrumbs
                isMobile={!fullWidth}
                separator={separator}
                pathname={pathname ?? 'test/room/any'}
                push={(href) => console.log(href)}
                linkStyle={linkStyleState}
                Link={({ href, children }) =>
                    <div
                        onClick={() => console.log(href)}
                    >
                        {children}
                    </div>
                }
            />
        </div>
    );
});