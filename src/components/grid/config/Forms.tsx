import React from "react";
export { TextInput, NumberInput, SliderInput } from '../../input';
import { Form, Schema } from '../../../index';
import { listAllComponents, listConfig } from './render';
import { TextType } from './type';
import { Box, useTheme } from "@mui/material";
import { useHookstate } from "@hookstate/core";
import { infoState } from "../context";

type PropsForm = {
    elemLink: any
    onChange: (data: Record<string, any>)=> void
}


const getColors =()=> {
    const palette = useTheme().palette;

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


export default function({ elemLink, onChange }: PropsForm) {
    const copyDataContent = React.useRef({});
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
    const useAddStory = () => {
        // Only add to story if we have a current state and it's different from the last entry
        if (current && (story.length === 0 || JSON.stringify(current) !== JSON.stringify(story[story.length - 1]))) {
            setStory(prev => [...prev, structuredClone(current)]);
            setFuture([]);
        }
    }
    const useEdit = (key: string, newValue: string) => {
        const copy = structuredClone(current);
        copy[key] = newValue;
        
        // Update current state
        setCurrent(copy);
        onChange();
    }
    const useCreateScheme =(type, propsElem)=> {
        const schema: Schema[] = [];

        if (type === 'Typography') {
            const props = listConfig.Typography.props;
            
            schema.push({
                type: 'text', id: 'children', multiline: true, value: propsElem.children, label: 'children'
            }, {
                type: 'toggle', id: 'color', items: getColors(), label: 'color', value: propsElem.color
            }, {
                type: 'select', label: 'variant', value: propsElem.variant, items: props.variant.map((key)=> ({
                    id: key,
                    label: key
                }))
            });
        }
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
    
                setStory([elem.props]);
                setCurrent(elem.props);
                setFuture([]);
                useCreateScheme(elem.props['data-type'], elem.props);
            }
        }
    }, [elemLink]);


    return(
        <Box sx={{display:'flex', flexDirection: 'column'}} >

        </Box>
    );
}