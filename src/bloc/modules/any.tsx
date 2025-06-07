import React from 'react';
import { lighten } from '@mui/system';
import { Divider, DividerProps, Chip, ChipProps, Avatar, AvatarProps, Rating, RatingProps, Typography, Badge } from '@mui/material';
import { uploadFile } from 'src/app/plugins';
import { iconsList, icons } from '../../components/tools/icons';
import { fill, empty } from '../../components/tools/icons-rating';
import { ComponentProps } from '../type';
import { updateComponentProps } from '../helpers/updateComponentProps';
import { exportTipTapValue, toJSXProps, toObjectLiteral, renderComponentSsr, toLiteral } from './export/utils';
import TipTapSlotEditor from './tip-tap';
import { infoSlice, editorContext} from "../context";
import { ToggleInput, HoverPopover, List } from '@lib/index';


type DividerWrapperProps = DividerProps & ComponentProps & {
    'border-color': string
    'border-style': 'dashed' | 'dotted' | 'solid'
}
type ChipWrapperProps = ChipProps & ComponentProps;
type RatingWrapperProps = RatingProps & ComponentProps & {
    iconName: ' Favorite' | 'ThumbUp' | 'Cafe' | 'Brain' | 'Fire' | 'none'
    isHalf: boolean
    apiPath?: string
    color?: string
}
type AvatarWrapperProps = AvatarProps & ComponentProps & {
    'data-source' : 'src' | 'icon' | 'children'
}
type ListWrapperProps = {
    'data-id': number
    'data-type': 'List'
    showLabels: boolean
    style: React.CSSProperties
    fullWidth: boolean
    isButton?: boolean
    isSecondary?: boolean
    styles?: {
        primary?: React.CSSProperties
        secondary?: {
            color?: string
            fontSize?: number 
        }
        icon?: {
            color?: string
            fontSize?: number 
        }
    }
}



export const DividerWrapper = React.forwardRef((props: DividerWrapperProps, ref) => {
    const { 
        'data-id': dataId, 
        'border-style': borderStyle,
        'border-color': borderColor,
        isChildren, 
        children, 
        fullWidth, 
        variant, 
        style, 
        ...otherProps 
    } = props;
    const selected = infoSlice.select.content.use();
    

    const handleBlur = (e) => {
        const newText = e.target.innerText;
        
        updateComponentProps({
            component: { props: props },
            data: { children: newText }
        });
    }
    const exportCode = (call) => {
        const sxLiteral = toObjectLiteral({ borderStyle, borderColor });
        const styleLiteral = toObjectLiteral({
            paddingTop: !isChildren && '4px',
            width: fullWidth ? '100%' : '',
            ...style
        });
        const renderChild =()=> {
            if(isChildren) return(`
                <Typography
                    variant='subtitle2'
                >
                    ${ children }
                </Typography>
            `);
            else return '';
        } 
        
        const code = (`
            import React from 'react';
            import { Divider, Typography } from '@mui/material';

            export default function DividerWrap() {
                return(
                    <Divider
                        flexItem
                        orientation={"${fullWidth ? 'horizontal' : 'vertical'}"}
                        variant={"${variant ?? 'fullWidth'}"}
                        style={{ ${styleLiteral} }}
                        sx={{ ${sxLiteral} }}
                    >
                        ${ renderChild() }
                    </Divider>
                );
            }
        `);

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
        <span
            ref={ref}
            data-id={dataId}
            data-type='Divider'
            style={{
                minHeight: !fullWidth ? '22px' : '14px',
                minWidth: '14px',
                width: fullWidth && '100%',
                paddingTop: !isChildren && '4px'
            }}
        >
            <Divider
                orientation={fullWidth ? 'horizontal' : 'vertical'}
                variant={variant}
                flexItem={fullWidth}
                sx={{
                    borderStyle,
                    borderColor
                }}
                style={ style }
                { ...otherProps }
            >
                {isChildren
                    ? <Typography
                        variant='subtitle2'
                        contentEditable={globalThis.EDITOR && selected?.props?.['data-id'] === dataId}
                        suppressContentEditableWarning
                        onBlur={handleBlur}
                        style={!fullWidth ? {
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                        } : {}}
                    >
                        { children }
                    </Typography>
                    : undefined
                }
            </Divider>
        </span>
    );
});
export const ChipWrapper = React.forwardRef((props: ChipWrapperProps, ref) => {
    const { 'data-id': dataId, fullWidth, avatar, label, icon, ...otherProps } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : undefined;

    const exportCode = (call) => {
        const ricon = Icon ? `icon={ ${renderComponentSsr(<Icon />)} }` : '';

        const code = (`
            import React from 'react';
            import { Chip } from '@mui/material';

            export default function ChipWrap() {
                return(
                    <Chip
                        component="a"
                        onClick={console.log}
                        onDelete={console.log}              // сделает возможность удаления
                        clickable={false}                   // кликабельность 
                        label={"${label}"}
                        ${ ricon }
                        ${ toJSXProps(otherProps) }
                    />
                );
            }
        `);

        call(code);
    }
    const handleChangeEdit = (key: string, data: string) => {
        updateComponentProps({
            component: { props },
            data: { [key]: data }
        });
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
        <Chip 
            component="a"
            icon={Icon ? <Icon /> : undefined}
            label={ label }
            { ...otherProps }
        />
    );
});
export const AvatarWrapper = React.forwardRef((props: AvatarWrapperProps, ref) => {
    const lastFileRef = React.useRef<number | null>(null);
    const [imgSrc, setImgSrc] = React.useState<string>();
    const {
        'data-source': source, 
        'data-id': dataId, 
        children, 
        src, 
        file, 
        sizes, 
        icon, 
        fullWidth, 
        isArea, 
        style,
        ...otherProps 
    } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : undefined;


    const handleUpload = async (file: File) => {
        setImgSrc('https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif');
        const filename = `img-${dataId}.${file.name.split('.').pop()}`;
        const url = await uploadFile(file, filename);


        setImgSrc(`${url}?v=${Date.now()}`);
        updateComponentProps({
            component: { props },
            data: { src: `${url}?${Date.now()}` }
        });
    }
    const exportCode = (call) => {
        const child = (source === 'children') ? children ? `"${children}"` : "H" : Icon ? renderComponentSsr(<Icon/>) : undefined;
        
        const code = (`
            import React from 'react';
            import { Avatar } from '@mui/material';

            export default function AvatarWrap() {
                return(
                    <Avatar
                        sx={{ 
                            width: ${sizes}, 
                            height: ${sizes},
                            bgColor: 'gray'
                        }}
                        src={"${imgSrc ?? ''}"}
                        style={{
                            ${toObjectLiteral({
                                ...style,
                                width: fullWidth ? "100%" : "fit-content",
                            })}
                        }}
                        ${ toJSXProps(otherProps) }
                    >
                        ${ child }
                    </Avatar>
                );
            }
        `);

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
    }, [props, imgSrc]);
    React.useEffect(() => {
        if(!EDITOR) return;

        if (file instanceof File) {
            const id = file.lastModified;

            if (id !== lastFileRef.current) {
                lastFileRef.current = id;
                handleUpload(file);
            }
        }
    }, [file]);
    React.useEffect(() => {
        if(!EDITOR) return;

        if (!src || src.length === 0) {
            setImgSrc('https://mui.com/static/images/avatar/3.jpg');
        }
        else setImgSrc(src);
    }, [src]);
    React.useEffect(() => {
        if(!EDITOR) return;

        if(source === 'children' || source === 'icon') setImgSrc(undefined);
        else setImgSrc(src);
    }, [source]);
    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Avatar'
            style={{
                ...style,
                width: fullWidth ? "100%" : "fit-content",
            }}
        >
            <Avatar 
                src={imgSrc}
                sx={{ 
                    width: sizes, 
                    height: sizes
                }}
                children={
                    (source === 'children')
                        ? children ? children : 'H'
                        : Icon ? <Icon/> : undefined
                }
                { ...otherProps }
            />
        </div>
    );
});
export const RatingWrapper = React.forwardRef((props: RatingWrapperProps, ref) => {
    const { 'data-id': dataId, iconName, apiPath, colors='#ff3d47', fullWidth, isHalf, style, ...otherProps } = props;

    const IconFill = (iconName && fill[iconName]) ? iconsList[iconName] : undefined;
    const IconEmpty = (iconName && empty[iconName]) ? empty[iconName] : undefined;

    const exportCode = (call) => {
        const icf = IconFill ? `icon={${renderComponentSsr(<IconFill fontSize="inherit" />)}}` : '';
        const ice = IconEmpty ? `emptyIcon={${renderComponentSsr(<IconEmpty fontSize="inherit" />)}}` : '';
        const handler = (apiPath 
            ? `
                fetch('${apiPath}', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rating: value })
                });
            `
            : `
                console.log(value);
            `
        );
        const styleLiteral = toObjectLiteral({
            ...style,
            width: fullWidth ? "100%" : "fit-content"
        });
        

        const code = (`
            import React from 'react';
            import { Rating } from '@mui/material';

            export default function RatingWrap() {
                return(
                    <div style={{ ${styleLiteral} }}>
                        <Rating
                            precision={${isHalf ? 0.5 : 1}}
                            sx={{
                                '& .MuiRating-iconFilled': {
                                    color: "${lighten(colors, 0.2)}",
                                },
                                '& .MuiRating-iconHover': {
                                    color: "${colors}",
                                }
                            }}
                            onChange={(e, value) => {
                                ${handler}
                            }}
                            ${icf}
                            ${ice}
                            ${ toJSXProps(otherProps) }
                        />
                    </div>
                );
            }
        `);

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
            data-type='Rating'
            style={{ 
                ...style,
                width: fullWidth ? "100%" : "fit-content"
            }}
        >
            <Rating
                icon={IconFill && <IconFill fontSize="inherit" />}
                emptyIcon={IconEmpty && <IconEmpty fontSize="inherit" />}
                precision={isHalf ? 0.5 : 1}
                sx={{
                    '& .MuiRating-iconFilled': {
                        color: lighten(colors, 0.2),
                    },
                    '& .MuiRating-iconHover': {
                        color: colors,
                    }
                }}
                onChange={(e, v) => {
                    sharedEmmiter.emit('event', {
                        id: dataId,
                        data: { value: v, apiPath },
                        type: 'onChange'
                    });
                }}
                { ...otherProps }
            />
        </div>
    );
});


export const ListWrapper = React.forwardRef((props: ListWrapperProps, ref) => {
    const {'data-id': dataId, style, isButton, isSecondary, fullWidth, items} = props;


    const handleChangeEdit = (index: number, data: {primary:string,secondary:string,startIcon:string}) => {
        const copy = JSON.parse(JSON.stringify(items));

        if (items[index]) {
            copy[index] = data;

            updateComponentProps({
                component: { props },
                data: { items: copy }
            });
        }
    }
    const iconEditable = (item: {primary:string,secondary:string,startIcon:string}, index: number) => {
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
                            startIcon: value
                        })}
                    />
                </div>
            );
        });

        const Icon = iconsList[item.startIcon];

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
        );
    }
    const textEditable = (key: 'primary'|'secondary', value: string, index: number) => {
        return (
            <TipTapSlotEditor
                autoIndex={index}
                value={value ?? ''}
                onChange={(html) => {
                    const copy = { ...items[index] };
                    copy[key] = html ?? '';
                    handleChangeEdit(index, copy);
                }}
                placeholder="Текст"
                className="no-p-margin"
                isEditable={EDITOR}
            />
        )
    }
    const parse = () => {
        return items.map((item, index)=> {
            const Icon = (item.startIcon && iconsList[item.startIcon]) ? iconEditable(item, index) : null;
            
            return ({
                startIcon: Icon ? Icon : undefined,
                primary: textEditable('primary', item.primary, index),
                secondary: isSecondary ? textEditable('secondary', item.secondary, index) : undefined
            });
        });
    }
    const exportCode = (call) => {
        const stylePrerender = {...style, width: fullWidth ? "100%" : "fit-content"};
        const itemsLitears = items.map((item, index)=> {
            const Icon = (item.startIcon && iconsList[item.startIcon]) ? iconsList[item.startIcon] : null;
            
            return ({
                startIcon: Icon ? {__raw: renderComponentSsr(<Icon />).trim() } : undefined,
                primary: { __raw: `(${exportTipTapValue(item.primary).trim()})` },
                secondary: isSecondary ? { __raw: `(${exportTipTapValue(item.secondary).trim()})` } : undefined
            });
        });
        

        const code = (`
            import React from 'react';
            import { List } from '@lib/index';

            export default function ListWrap() {
                const items = ${toLiteral(itemsLitears)};

                
                return(
                    <div style={ ${toLiteral(stylePrerender)} }>
                        <List
                            onClick={${isButton ? '(index: number, item)=> console.log(index)' : 'undefined'}}
                            items={items}
                        />
                    </div>
                );
            }
        `);

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
    const parsedItems = React.useMemo(() => parse(), [items, isSecondary]);
    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='List'
            style={{
                ...style,
                width: fullWidth ? "100%" : "fit-content"
            }}
        >
            <List
                onClick={isButton && console.log}
                items={parsedItems}
            />
        </div>
    );
});
