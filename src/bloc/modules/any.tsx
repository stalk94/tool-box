import React from 'react';
import { lighten } from '@mui/system';
import { Divider, DividerProps, Chip, ChipProps, Avatar, AvatarProps, Rating, RatingProps } from '@mui/material';
import { List, ListItem, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material';
import { uploadFile } from 'src/app/plugins';
import { iconsList } from '../../components/tools/icons';
import { fill, empty } from '../../components/tools/icons-rating';
import { ComponentProps } from '../type';
import { deserializeJSX } from '../helpers/sanitize';
import { updateComponentProps } from '../helpers/updateComponentProps';
import { renderComponentSsr, toObjectLiteral } from './export/utils';
import { toJSXProps } from './export/Inputs';


type DividerWrapperProps = DividerProps & ComponentProps;
type ChipWrapperProps = ChipProps & ComponentProps;
type RatingWrapperProps = RatingProps & ComponentProps & {
    iconName: 'Star' | ' Favorite' | 'ThumbUp' | 'Cafe' | 'Brain' | 'Fire' | 'none'
    apiPath?: string
    color?: string
}
type AvatarWrapperProps = AvatarProps & ComponentProps & {
    'data-source' : 'src' | 'icon' | 'children'
}



export const DividerWrapper = React.forwardRef((props: DividerWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const { 'data-id': dataId, children, fullWidth, orientation, variant, ...otherProps } = props;
    const parsedChild = React.useMemo(() => deserializeJSX(children), [children]);

    degidratationRef.current = (call) => {
        const code = (`
            import React from 'react';
            import { Divider } from '@mui/material';

            export default function DividerWrap() {
                return(
                    <Divider
                        flexItem
                        orientation={"${orientation??'horizontal'}"}
                        variant={"${variant ?? 'fullWidth'}"}
                    >
                        ${ renderComponentSsr(parsedChild) }
                    </Divider>
                );
            }
        `);

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
        <Divider
            ref={ref}
            data-id={dataId}
            data-type='Divider'
            orientation={orientation}
            variant={variant}
            flexItem
            {...otherProps}
        >
            { parsedChild }
        </Divider>
    );
});
export const ChipWrapper = React.forwardRef((props: ChipWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const { 'data-id': dataId, fullWidth, avatar, label, icon, ...otherProps } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : undefined;

    degidratationRef.current = (call) => {
        const ri = Icon ? `icon={ ${renderComponentSsr(<Icon />)} }` : '';

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
                        ${ ri }
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
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);


    return (
        <Chip 
            component="a"
            icon={Icon ? <Icon /> : undefined}
            label={
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
                        handleChangeEdit('label', e.currentTarget.innerText);
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
                    { label }
                </div>
            }
            { ...otherProps }
        />
    );
});
export const AvatarWrapper = React.forwardRef((props: AvatarWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const lastFileRef = React.useRef<number | null>(null);
    const [imgSrc, setImgSrc] = React.useState<string>();

    const {'data-source': source, 'data-id': dataId, children, src, file, sizes, icon, fullWidth, ...otherProps } = props;
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
    degidratationRef.current = (call) => {
        const child = (source === 'children') ? children ? `"${children}"` : "H" : Icon ? renderComponentSsr(<Icon/>) : undefined;
        
        const code = (`
            import React from 'react';
            import { Avatar } from '@mui/material';

            export default function AvatarWrap() {
                return(
                    <div style={{${fullWidth ? 'width: "100%"' : 'width: "fit-content"'}}}>
                    <Avatar
                        sx={{ 
                            width: ${sizes}, 
                            height: ${sizes},
                            bgColor: 'gray'
                        }}
                        src={"${imgSrc ?? ''}"}
                        ${ toJSXProps(otherProps) }
                    >
                        ${ child }
                    </Avatar>
                    </div>
                );
            }
        `);

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
        if (file instanceof File) {
            const id = file.lastModified;

            if (id !== lastFileRef.current) {
                lastFileRef.current = id;
                handleUpload(file);
            }
        }
    }, [file]);
    React.useEffect(() => {
        if (!src || src.length === 0) {
            setImgSrc('https://mui.com/static/images/avatar/3.jpg');
        }
        else setImgSrc(src);
    }, [src]);
    React.useEffect(() => {
        if(source === 'children' || source === 'icon') setImgSrc(undefined);
        else setImgSrc(src);
    }, [source]);
    

    return (
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
    );
});
export const RatingWrapper = React.forwardRef((props: RatingWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const { 'data-id': dataId, iconName, apiPath, colors='#ff3d47', fullWidth, style, ...otherProps } = props;

    const IconFill = iconName && fill[iconName] ? iconsList[iconName] : undefined;
    const IconEmpty = iconName && empty[iconName] ? empty[iconName] : undefined;

    degidratationRef.current = (call) => {
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
            data-type='Rating'
            style={{ 
                ...style,
                width: fullWidth ? "100%" : "fit-content"
            }}
        >
            <Rating
                icon={IconFill && <IconFill fontSize="inherit" />}
                emptyIcon={IconEmpty && <IconEmpty fontSize="inherit" />}
                sx={{
                    '& .MuiRating-iconFilled': {
                        color: lighten(colors, 0.2),
                    },
                    '& .MuiRating-iconHover': {
                        color: colors,
                    }
                }}
                onChange={(e, v) => console.log('RATING: ', v)}
                { ...otherProps }
            />
        </div>
    );
});
