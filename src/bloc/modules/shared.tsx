import React from 'react';
import { Box, IconButton} from '@mui/material';
import ToolBarApp from './sources/app-bar-tools';
import { Settings } from '@mui/icons-material';
import { AppBar, Start, LinearNavigation, MobailBurger, Breadcrumbs } from '../../index';
import renderAppBar, { exportBreadCrumbs } from './export/shared';
import { updateComponentProps } from '../helpers/updateComponentProps';
import { useComponentSizeWithSiblings } from './helpers/hooks';
import { icons, iconsList } from '@components/tools/icons';
import { uploadFile } from 'src/app/plugins';
import { editorContext } from "../context";


////////////////////////////////////////////////////////////////////////////////////////
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
    logo: string
    file: string
    linkItems: []
    elevation: number
}
type BreadcrumbsWrapperProps = {
    'data-id': number
    'data-type': 'Breadcrumbs'
    fontSize: number
    fullWidth: boolean
    style: React.CSSProperties
    pathname: string
    separator: string
}
////////////////////////////////////////////////////////////////////////////////////////



export const HeaderWrapper = React.forwardRef((props: HeaderWrapperProps, ref) => {
    const [src, setSrc] = React.useState(undefined);
    const [openBar, setOpenBar] = React.useState(false);
    const meta = editorContext.meta.use();
    const lastFileRef = React.useRef<number | null>(null);
    const {
        ['data-id']: dataId,
        style,
        styles,
        logo,
        file,
        linkItems,
        elevation,
        ...otherProps
    } = props;
    const { height } = useComponentSizeWithSiblings(dataId);


    const exportCode = (call) => {
        const code = renderAppBar(
            src,
            {
                width: '100%',
                height: '100%',
                ...style 
            },
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
    }
    const useEdit = (data) => {
        editorContext.dragEnabled.set(true);
        updateComponentProps({
            component: { props },
            data: data
        });
    }
    const handlerClickNavigation = (path: 'string') => {
        console.log(path);
    }
    const transformUseRouter = (items) => {
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

        const result = func(items ?? []);
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
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);
    const parseItems =React.useMemo(()=> {
        return transformUseRouter(JSON.parse(JSON.stringify(linkItems)));
    }, [linkItems]);
    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='AppBar'
            style={{
                ...style,
                width: '100%', 
                height: '100%',
                overflow: 'hidden'
            }}
        >
            {/* панель настроек отдельная */}
            { (EDITOR && meta.scope === 'system') &&
                <>
                    <div style={{position: 'absolute', zIndex:999, left:0, top:0}}>
                        <IconButton
                            sx={{
                                color:'', 
                                backdropFilter: 'blur(4px)', 
                                padding: '3px',
                                '&:hover': {
                                    color: 'rgba(237, 64, 37, 0.773)'
                                }
                            }}
                            onClick={()=> {
                                setOpenBar(true);
                                editorContext.dragEnabled.set(false);
                            }}  
                            children={<Settings/>}
                        />
                    </div>
                    <ToolBarApp 
                        data={{
                            linkItems
                        }}
                        onChange={useEdit}
                        open={openBar}
                        setOpen={setOpenBar}
                    /> 
                </>
            }

            <AppBar
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
                            ml: 4,
                            ...styles?.navigation
                        }}
                        items={parseItems}
                    />
                }
                end={
                    <React.Fragment>
                        <MobailBurger
                            items={parseItems}
                        />
                        
                    </React.Fragment>
                }
            />
        </div>
    );
});

export const BreadcrumbsWrapper = React.forwardRef((props: BreadcrumbsWrapperProps, ref) => {
    const {
        'data-id': dataId,
        style,
        pathname,
        separator,
        fontSize,
        fullWidth,
        ...otherProps
    } = props;

    const meta = editorContext.meta.get();
    const exportCode = (call) => {
        const linkStyleState = {
            fontFamily: style?.fontFamily,
            fontSize: style?.fontSize,
            fontWeight: style?.fontWeight,
            fontStyle: style?.fontStyle,
            textDecoration: style?.textDecoration,
            textDecorationStyle: style?.textDecorationStyle,
        };

        const code = exportBreadCrumbs(
            separator,
            linkStyleState,
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
            { ...otherProps }
        >
            <Breadcrumbs
                isMobile={!fullWidth}
                separator={separator}
                pathname={`test/${meta.scope}/${meta.name}`}
                push={(href) => console.log(href)}
                linkStyle={{
                    fontFamily: style?.fontFamily,
                    fontSize: fontSize ?? style?.fontSize,
                    fontWeight: style?.fontWeight,
                    fontStyle: style?.fontStyle,
                    textDecoration: style?.textDecoration,
                    textDecorationStyle: style?.textDecorationStyle,
                }}
                Link={({ href, children }) =>
                    <div
                        onClick={() => console.log(href)}
                    >
                        { children }
                    </div>
                }
            />
        </div>
    );
});
