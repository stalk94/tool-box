import React from "react";
export { TextInput, NumberInput, SliderInput } from '../../components/input';
import { Form, Schema } from '../../index';
import { listConfig } from './render';
import { Box, Theme, Tooltip, useTheme } from "@mui/material";
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight, LinearScale,  
    ViewColumn, ViewList, ViewQuilt, ViewArray, ViewCarousel, ViewComfy, ViewCompact, ViewModule, ViewAgenda, Widgets
} from "@mui/icons-material";
import { iconsList } from '../../components/tools/icons';
import { PropsTypes } from './type';


type PropsForm = {
    elemLink: any
    type: 'props'|'base'|'flex'|'text'
    onChange: (data: Record<string, any>)=> void
}

//-----------------------------------------------------------------------
const getColors =(theme: Theme)=> {
    const palette = theme.palette;

    const color = {
        primary: palette.primary.main,
        secondary: palette.secondary.main,
        error: palette.error.main,
        success: palette.success.main,
        info: palette.info.main,
        warning: palette.warning.main,
        textPrimary: palette.text.primary,
        textSecondary: palette.text.secondary
    }

    return Object.keys(color).map((key)=> {
        return {
            label: <div style={{width:'20px',height:'20px',background:color[key]}}/>,
            id: key
        }
    });
}
const fabrickStyle =(listTypes, tStyle)=> {
    const result: Schema[] = [];

    Object.keys(listTypes).forEach((key, index) => {
        if (Array.isArray(listTypes[key])) {
            const length = listTypes[key].length;

            const schema = {
                id: key,
                type: length > 4 ? 'select' : 'toggle',
                label: key,
                value: tStyle[key],
                labelSx: {
                    fontSize: '14px',
                    color: '#f8f7f4'
                },
                items: listTypes[key].map((label, id) => ({
                    label: label,
                    id: label
                }))
            }
            result.push(schema);
        }
        // диапазоны
        else if(true) {
            const schema = {
                id: key,
                type: 'text',
                label: key,
                value: tStyle[key],
                labelSx: {
                    fontSize: '14px',
                    color: '#fcfbfa'
                },
            }
            result.push(schema);
        }
    });

    return result;
}
const getScheme =(type, defaultValue, typeProps: PropsTypes)=> {
    const alightsIcons = {
        left: <FormatAlignLeft/>,  
        center: <FormatAlignCenter/>,
        right: <FormatAlignRight/>,
        justify: <FormatAlignJustify/>
    }
    const displayIcons = {
        initial: <span style={{fontSize:'11px',whiteSpace: 'nowrap'}}>init</span>,
        block: <LinearScale/>,
        inline: <ViewColumn/>,
        'inline-block': <span style={{fontSize:'11px',whiteSpace: 'nowrap'}}>in-b</span>,
        flex: <Widgets/>,
        'inline-flex': <ViewList/>,
        grid: <ViewQuilt/>,
        'inline-grid': <ViewArray/>
    }
    Object.keys(displayIcons).map((key)=> {
        displayIcons[key] = (
            <Tooltip title={key} placement="top" arrow>
                { displayIcons[key] }
            </Tooltip>
        )
    });

    if(typeProps === 'children' && typeof defaultValue === 'string') {
        return {
            type: 'text',
            id: typeProps,
            multiline: true,
            value: defaultValue,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
    else if(typeProps === 'color') {
        return {
            type: 'toggle',
            id: typeProps,
            items: '',
            label: typeProps,
            value: defaultValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if(typeProps === 'variant') {
        return {
            type: 'select',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            onlyId: true,
            value: defaultValue,
            items: listConfig[type].props[typeProps].map((key) => ({
                id: key,
                label: key
            }))
        }
    }
    else if(typeProps === 'size') {
        return {
            type: 'toggle',
            id: typeProps,
            items: [
                { id: 'small', label: <var style={{fontStyle:'italic'}}>sm</var> },
                { id: 'medium', label: <var style={{fontWeight:400}}>sm</var> },
                { id: 'large', label: <var style={{fontWeight:'bold'}}>lg</var> }
            ],
            label: typeProps,
            value: defaultValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if(typeProps === 'display') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: listConfig[type].props[typeProps].map((key) => ({
                id: key,
                label: displayIcons[key]
            }))
        }
    }
    else if(typeProps === 'align') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: listConfig[type].props[typeProps].map((key) => ({
                id: key,
                label: alightsIcons[key]
            }))
        }
    }
    else if(typeProps === 'fullWidth') {
        return {
            type: 'switch',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
        }
    }
    else if(typeProps === 'type') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: listConfig[type].props[typeProps].map((key) => ({
                id: key,
                label: <span style={{fontSize:'11px',whiteSpace: 'nowrap'}}>{key}</span>
            }))
        }
    }
    else if(typeProps === 'icon' || 'endIcon' || 'startIcon') {
        const r = Object.keys(iconsList).map((key)=> {
            const Render = iconsList[key];

            return({
                id: key,
                label: <Render />
            })
        });
        r.unshift({
            id: 'none',
            label: <span style={{fontSize:'10px',whiteSpace: 'nowrap',color:'gray'}}>✖️</span>
        });

        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: r
            
        }
    } 
}



export default function({ type, elemLink, onChange }: PropsForm) {
    const theme = useTheme();
    const copyDataContent = React.useRef({});
    const [schema, setSchema] = React.useState<Schema[]>([]);
    const [story, setStory] = React.useState<Record<string, string>[]>([]);
    const [future, setFuture] = React.useState<Record<string, string>[]>([]);
    const [current, setCurrent] = React.useState<Record<string, any>>(null);

    const undo = () => {
        if (story.length <= 1) return; // Nothing to undo
        
        // Take the current state and add it to future for potential redo
        setFuture(prev => [structuredClone(current), ...prev]);
        
        // Get the previous state from story
        const newStory = story.slice(0, -1);
        const previousState = structuredClone(newStory[newStory.length - 1]);
        
        // Update current state and apply it to the theme
        
        
        // Update story array
        setStory(newStory);
    }
    const redo = () => {
        if (future.length === 0) return; // Nothing to redo
        
        // Get the next state from future
        const nextState = structuredClone(future[0]);
        const newFuture = future.slice(1);
        
        // Add current state to history before applying the next state
        setStory(prev => [...prev, structuredClone(current)]);
        
        // Update current state and apply it to the theme
        
        
        // Update future array
        setFuture(newFuture);
    }
    const useAddStory = (current) => {
        // Only add to story if we have a current state and it's different from the last entry
        if (current && (story.length === 0 || JSON.stringify(current) !== JSON.stringify(story[story.length - 1]))) {
            setStory(prev => [...prev, structuredClone(current)]);
            setFuture([]);
        }
    }
    const useEdit = (key: string, newValue: string) => {
        setCurrent((copy)=> {
            copy[key] = newValue;
        
            // Update current state
            useAddStory(copy);
            onChange(copy);
            return copy;
        });
    }
    const useCreateScheme =(typeContent, propsElem)=> {
        const schema: Schema[] = [];

        if (typeContent === 'Typography') {
            const children = getScheme(typeContent, propsElem.children, 'children');
            const color = getScheme(typeContent, propsElem.color, 'color');
            const variant = getScheme(typeContent, propsElem.variant, 'variant');
            const display = getScheme(typeContent, propsElem.display, 'display');
            const align = getScheme(typeContent, propsElem.align, 'align');
            color.items = getColors(theme);

            schema.push(
                children as Schema<'text'>,
                color as Schema<'toggle'>,
                variant as Schema<'select'>,
                display as Schema<'toggle'>,
                align as Schema<'toggle'>
            );
        }
        else if (typeContent === 'Button') {
            const children = getScheme(typeContent, propsElem.children, 'children');
            const color = getScheme(typeContent, propsElem.color, 'color');
            const variant = getScheme(typeContent, propsElem.variant, 'variant');
            const fullWidth = getScheme(typeContent, propsElem.fullWidth, 'fullWidth');
            const type = getScheme(typeContent, propsElem.type, 'type');
            const size = getScheme(typeContent, propsElem.size, 'size');
            const startIcon = getScheme(typeContent, propsElem.startIcon, 'startIcon');
            const endIcon = getScheme(typeContent, propsElem.endIcon, 'endIcon');
            color.items = getColors(theme);

            schema.push(
                children as Schema<'text'>,
                type as Schema<'toggle'>,
                size as Schema<'toggle'>,
                fullWidth as Schema<'switch'>,
                color as Schema<'toggle'>,
                variant as Schema<'select'>,
                startIcon as Schema<'toggle'>,
                endIcon as Schema<'toggle'>,
            );
        }
        else if (typeContent === 'IconButton') {
            const color = getScheme(typeContent, propsElem.color, 'color');
            const size = getScheme(typeContent, propsElem.size, 'size');
            const icon = getScheme(typeContent, propsElem.icon, 'icon');
            color.items = getColors(theme);

            schema.push(
                color as Schema<'toggle'>,
                size as Schema<'toggle'>,
                icon as Schema<'toggle'>,
            );
        }
        
        return schema;
    }

    React.useEffect(() => {
        if(elemLink) {
            const elem = elemLink.get({ noproxy: true });
            
            if(elem?.props 
                && (elem?.props['data-id'] !== copyDataContent?.current?.id 
                    || copyDataContent?.current?.type !== type
                ) 
            ) {
                copyDataContent.current = ({
                    type: type,
                    id: elem.props['data-id'],
                });

                const copyProps = structuredClone(elem.props);
                setStory([copyProps]);
                setCurrent(copyProps);
                setFuture([]);
                const schema = useCreateScheme(elem.props['data-type'], copyProps);
                setSchema([...schema]);
            }
        }
    }, [elemLink, type]);


    return(
        <Box sx={{display:'flex', flexDirection: 'column'}} >
            <Form
                scheme={schema}
                labelPosition="column"
                onSpecificChange={(old, news)=> {
                    Object.keys(news).map((key)=> useEdit(key, news[key]))
                }}
            />
        </Box>
    );
}