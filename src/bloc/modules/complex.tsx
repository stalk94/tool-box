import React from 'react';
import * as XLSX from 'xlsx';
import { Accordion, AccordionProps, HoverPopover } from '../../index';
import { icons, iconsList } from '@components/tools/icons';
import { Box, Tabs, Button, Tab, BottomNavigation, BottomNavigationAction, Paper, TabsProps, Typography } from '@mui/material';
import { ComponentProps, DataNested } from '../type';
import { triggerFlyFromComponent } from './helpers/anim';
import { useEvent, useCtxBufer } from './helpers/shared';
import DataTable, { DataSourceTableProps } from './sources/storage';
import { useComponentSizeWithSiblings } from './helpers/hooks';
import { AppBar, Start, LinearNavigation, MobailBurger, Breadcrumbs, ToggleInput } from '../../index';
import { updateComponentProps } from '../helpers/updateComponentProps';
import { uploadFile } from 'src/app/plugins';
import render, { exportedTabs, exportedBottomNav, exportedTable } from './export/Acordeon';
import renderAppBar, { exportBreadCrumbs } from './export/AppBar';
import { DropSlot, ContextSlot } from '../Dragable';
import { AddBox, PlaylistAdd } from '@mui/icons-material';
import { useEditorContext } from "../context";


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
type BreadcrumbsWrapperProps = {
    'data-id': number
    'data-type': 'Breadcrumbs'
    fullWidth: boolean
    style: React.CSSProperties
    pathname: string
    separator: string
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
    items: string[]
    fullWidth?: boolean
    slots: Record<string, DataNested>
}
type TableSourcesProps = DataSourceTableProps & ComponentProps & {
    'data-type': 'DataTable'
    fullWidth: boolean
    style: React.CSSProperties
    styles: {
        body: React.CSSProperties & {
            background: string
            borderColor: string
            textColor: string
        }
        header: React.CSSProperties & {
            background: string
        }
        thead: React.CSSProperties & {
            background: string
            textColor: string
        }
    }
}
type HeaderWrapperProps = {
    'data-id': string | number
    'data-type': 'AppBar'
    fullWidth: boolean
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
    const { 'data-id': dataId, style, items, styles, activeIndexs, slots, fullWidth, ...otherProps } = props;
    const { width, height, container } = useComponentSizeWithSiblings(dataId);

    const handleChange = (index: number, data: string) => {
        const copy = [...items];

        if (copy[index]) {
            copy[index].title = data;

            updateComponentProps({
                component: { props },
                data: { items: [...copy] }
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
                    {text}
                </div>
            );
            const SlotContent = () => (
                <ContextSlot
                    idParent={dataId} 
                    idSlot={index}
                    data={{
                        ...slots[index],
                        size: {
                            width: container.width, 
                            height:container.height/4
                        }
                    }}
                    nestedComponentsList={{
                        Button: true,
                        Typography: true
                    }}
                />
            );

            return ({
                title: <EditComponent />,
                content: <SlotContent />,
            });
        });
    }
    const parsedItems = React.useMemo(() => parse(), [props, width]);

    degidratationRef.current = (call) => {
        const code = render(
            useEditorContext().meta.get({noproxy:true}),
            activeIndexs,
            styles,
            items,
            slots,
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
    const { width, height, container } = useComponentSizeWithSiblings(dataId);

    degidratationRef.current = (call) => {
        const code = exportedTabs(
            useEditorContext().meta.get({noproxy:true}),
            items,
            textColor,
            slots
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
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        emiter('onChange', newValue);
        //storage(newValue);
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    const handleChangeEdit = (index: number, data: string) => {
        if (items[index]) {
            items[index] = data;

            updateComponentProps({
                component: { props },
                data: { items: [...items] }
            });
        }
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
            style={{ ...style, width: '100%', display: 'block' }}
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
            {/* Слоты */}
            <ContextSlot
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
    const degidratationRef = React.useRef<(call) => void>(() => { });
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
    
    
    degidratationRef.current = (call) => {
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
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    const handleChangeEdit = (index: number, data: {label:string,icon:string,id:string}) => {
        if (items[index]) {
            items[index] = data;

            updateComponentProps({
                component: { props },
                data: { items: [...items] }
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
            const Icon = (item.icon && iconsList[item.icon]) ? iconEditable(item, index) : null;
            const label = item.label ? labelEditable(item, index) : undefined;
            
            return {
                icon: Icon ? Icon : undefined,
                label
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

export const DataTableWrapper = React.forwardRef((props: TableSourcesProps, ref) => {
    const [data, setData] = React.useState([
        { test: 1, name: 'никалай' },
        { test: 3, name: 'степан' },
        { test: 5, name: 'олег' },
        { test: 3, name: 'гриша' },
        { test: 5, name: 'вася' },
    ]);
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const lastFileRef = React.useRef<number | null>(null);
    const {
        'data-id': dataId,
        style,
        header,
        footer,
        sourceType,
        source,
        fullWidth,
        fontSizeHead,
        file,
        styles,
        ...otherProps
    } = props;
    const { width, height } = useComponentSizeWithSiblings(dataId);


    degidratationRef.current = (call) => {
        const inferColumns = (data: any[]) => {
            const result = [];
            const first = data[0];

            Object.keys(first).map((key) => {
                if (key.length > 0 && key !== 'id') result.push({
                    field: key,
                    header: key.toUpperCase(),
                })
            });

            return result;
        }

        const code = exportedTable(
            data,
            inferColumns(data),
            fontSizeHead,
            {...style, display: 'block', width: '100%'},
            styles,
            otherProps
        );
        console.log(code)
        call(code);
    }
    const handleUpload = (file: File) => {
        const ext = file.name.split('.').pop()?.toLowerCase();

        const handleJSONImport = (file: File) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const json = JSON.parse(reader.result as string);
                    if (Array.isArray(json)) setData(json);
                    else alert('Ожидается массив объектов в JSON');
                } 
                catch (err) { alert('Ошибка чтения JSON'); }
            }
            reader.readAsText(file);
        }
        const handleCSVImport = (file: File) => {
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result as string;
                const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

                if (lines.length === 0) return;

                const headers = lines[0].split(',');
                const parsedData = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const row: Record<string, any> = {};
                    headers.forEach((h, i) => {
                        row[h] = values[i];
                    });
                    return row;
                });

                setData(parsedData);
            };
            reader.readAsText(file);
        }
        const handleExcelImport = (file: File) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(worksheet);

                setData(parsedData);
            }
            reader.readAsArrayBuffer(file);
        }

        if (ext === 'json') {
            handleJSONImport(file);
        } else if (ext === 'csv') {
            handleCSVImport(file);
        } else if (ext === 'xlsx' || ext === 'xls') {
            handleExcelImport(file);
        } else {
            alert('Неподдерживаемый формат');
        }
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
        if (file instanceof File) {
            const id = file.lastModified;

            if (id !== lastFileRef.current) {
                lastFileRef.current = id;
                handleUpload(file);
            }
        }
    }, [file]);
    const handleAddRow = () => {
        setData((old)=> {
            const copyData = { ...old[0] };

            Object.keys(copyData).map((key) => {
                copyData[key] = '';
            });

            return [...old, copyData];
        });
    }
    const handleAddField = () => {
        const newField = prompt('Название нового поля');
        if (!newField || data[0][newField]) return;
        
        const updated = data.map((row) => ({
            ...row,
            [newField]: '',
        }));
        if (updated.length === 0) updated.push({ [newField]: '' })
        setData([...updated]);

        console.log(updated);
    }
    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='DataTable'
            style={{ ...style, width: '100%' }}
            fontSizeHead={fontSizeHead}
        >
             <DataTable
                style={{
                    maxHeight: '100%',
                    overflowX: 'auto'
                }}
                header={
                    <div style={{ fontSize: 12, color: 'gray', height: 30, display: 'flex', flexDirection: 'row', padding: 3 }}>
                        <div className='buttontable' 
                            style={{ marginLeft: 10, cursor: 'pointer', color: 'silver' }} 
                            onClick={handleAddField}
                        >
                            <AddBox sx={{ fontSize: 24 }} />
                        </div>
                        <div className='buttontable' 
                            style={{ marginLeft: 15, cursor: 'pointer', color: 'silver' }} 
                            onClick={handleAddRow}
                        >
                            <PlaylistAdd sx={{ fontSize: 26 }} />
                        </div>
                    </div>
                }
                footer={
                    <div style={{display:'flex',marginLeft:'auto'}}>
                        <Button 
                            variant='outlined'
                            color='navigation'
                            size='small' 
                            sx={{p:0.2, m:0, mr:0.3,opacity:0.6, fontSize:10}}
                        >
                            csv
                        </Button>
                        <Button 
                            variant='outlined'
                            color='navigation'
                            size='small' 
                            sx={{p:0.2, m:0, mr:0.3,opacity:0.6, fontSize:10}}
                        >
                            xslx
                        </Button>
                        <Button 
                            variant='outlined'
                            color='navigation'
                            size='small' 
                            sx={{p:0.2, m:0, mr:0.3,opacity:0.6, fontSize:10}}
                        >
                            json
                        </Button>
                    </div>
                }
                onChange={setData}
                style={{width: '100%', maxHeight: height}}
                source={data}
                sourceType='json'
                { ...otherProps }
            />
        </div>
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
export const BreadcrumbsWrapper = React.forwardRef((props: BreadcrumbsWrapperProps, ref) => {
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