import React from "react";
export { TextInput, NumberInput, SliderInput } from '../../input';
import { Form, Schema } from '../../../index';
import { listAllComponents, listConfig } from './render';
import { TextType } from './type';
import { Box, Theme, useTheme } from "@mui/material";
import { useHookstate } from "@hookstate/core";
import { infoState } from "../context";

type PropsForm = {
    elemLink: any
    type: 'props'|'base'|'flex'|'text'
    onChange: (data: Record<string, any>)=> void
}


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
// todo: доделать фабрику схем
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
            const props = listConfig.Typography.props;
            
            schema.push({
                type: 'text', 
                id: 'children', 
                multiline: true, 
                value: propsElem.children, 
                label: 'children',
                labelSx: {fontSize:'12px'},
                sx: { fontSize: 14 }
            }, {
                type: 'toggle', 
                id: 'color', 
                items: getColors(theme), 
                label: 'color', 
                value: propsElem.color,
                labelSx: {fontSize:'12px'}
            }, {
                type: 'select', 
                id: 'variant', 
                label: 'variant', 
                labelSx: {fontSize:'12px'},
                onlyId: true,
                value: propsElem.variant, 
                items: props.variant.map((key)=> ({
                    id: key,
                    label: key
                }))
            },
            );
        }
        
        return schema;
    }

    
    React.useEffect(() => {
        if(elemLink) {
            const elem = elemLink.get({ noproxy: true });
            console.log('OBJECT EDITOR: ', elem);
    
            if(elem?.props) {
                copyDataContent.current = ({
                    type: elem.props['data-type'],
                    id: elem.props['data-id'],
                    offset: elem.props['data-offset']
                });

                const copyProps = structuredClone(elem.props);
                setStory([copyProps]);
                setCurrent(copyProps);
                setFuture([]);
                const schema = useCreateScheme(elem.props['data-type'], copyProps);
                setSchema(schema);
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