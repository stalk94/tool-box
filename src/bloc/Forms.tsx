import React from "react";
export { TextInput, NumberInput, SliderInput } from '../components/input';
import { Form, Schema } from '../index';
import { useTheme } from "@mui/material";
import { fabrickPropsScheme, fabrickStyleScheme, getColors } from './config/utill';
import { motion } from 'framer-motion';
import { sanitizeProps } from './utils/sanitize';
import { debounce } from 'lodash';

type PropsForm = {
    elemLink: any
    type: 'props'|'base'|'flex'|'text'
    onChange: (data: Record<string, any>)=> void
}


// составляет индивидуальную схему пропсов
const useCreateSchemeProps = (typeContent, propsElem, theme) => {
    const schema: Schema[] = [];

    if (typeContent === 'Typography') {
        const children = fabrickPropsScheme(typeContent, propsElem.children, 'children');
        const color = fabrickPropsScheme(typeContent, propsElem.color, 'color');
        const variant = fabrickPropsScheme(typeContent, propsElem.variant, 'variant');
        const display = fabrickPropsScheme(typeContent, propsElem.display, 'display');
        const align = fabrickPropsScheme(typeContent, propsElem.align, 'align');
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
        const children = fabrickPropsScheme(typeContent, propsElem.children, 'children');
        const color = fabrickPropsScheme(typeContent, propsElem.color, 'color');
        const variant = fabrickPropsScheme(typeContent, propsElem.variant, 'variant');
        const fullWidth = fabrickPropsScheme(typeContent, propsElem.fullWidth, 'fullWidth');
        const type = fabrickPropsScheme(typeContent, propsElem.type, 'type');
        const size = fabrickPropsScheme(typeContent, propsElem.size, 'size');
        const startIcon = fabrickPropsScheme(typeContent, propsElem.startIcon, 'startIcon');
        const endIcon = fabrickPropsScheme(typeContent, propsElem.endIcon, 'endIcon');
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
        const color = fabrickPropsScheme(typeContent, propsElem.color, 'color');
        const size = fabrickPropsScheme(typeContent, propsElem.size, 'size');
        const icon = fabrickPropsScheme(typeContent, propsElem.icon, 'icon');
        color.items = getColors(theme);

        schema.push(
            color as Schema<'toggle'>,
            size as Schema<'toggle'>,
            icon as Schema<'toggle'>,
        );
    }
    else if (typeContent === 'Image') {
        const src = fabrickPropsScheme(typeContent, propsElem.src, 'src');
        const alt = fabrickPropsScheme(typeContent, propsElem.alt, 'alt');
        const sizes = fabrickPropsScheme(typeContent, propsElem.sizes ?? '100vw', 'sizes');
    
        schema.push(
            src as Schema<'text'>,
            alt as Schema<'text'>,
            sizes as Schema<'text'>
        );
    
        const imgixParams = {
            id: 'imgixParams',
            type: 'text',
            multiline: true,
            label: 'imgixParams',
            value: JSON.stringify(propsElem.imgixParams ?? {}, null, 2),
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 12 },
        };
    
        schema.push(imgixParams as Schema<'text'>);
    }
    
    return schema;
}


export default function({ type, elemLink, onChange }: PropsForm) {
    const theme = useTheme();
    const copyDataContent = React.useRef({});           // кэш во избежание перерендеров
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
        if (current && (story.length === 0 || JSON.stringify(current) !== JSON.stringify(story[story.length - 1]))) {
            setFuture(prev => [sanitizeProps(current), ...prev]);
            setStory(prev => [...prev, sanitizeProps(current)]);
        }
    }
    const useMergeObject = (key: 'style'|'sx', newValue: any) => {
        setCurrent((prev) => {
            const next = {
                ...prev,
                [key]: { ...(prev[key] ?? {}), ...newValue }
            };
            useAddStory(next);
            onChange(next);
            return next;
        });
    }
    const useEdit = React.useCallback(
        debounce((key: string, newValue: string) => {
            const type = copyDataContent?.current?.type;

            if (type === 'props') {
                setCurrent((prev) => {
                    const next = { ...prev, [key]: newValue };
                    useAddStory(next);
                    onChange(next);
                    return next;
                });
            } 
            else {
                setSchema((schema) => {
                    const elem = elemLink.get({ noproxy: true });
                    const find = schema.find((s) => s.id === key);
                    const unit = find?.unit ?? '';
                    useMergeObject('style', { [key]: newValue + unit });
                    return schema;
                });
            }
        }, 250),
        [elemLink, onChange]
    );
    const createScheme = (typeComponent: 'string', props: Record<string, any>) => {
        if(type === 'props') return useCreateSchemeProps(typeComponent, props, theme);
        else return fabrickStyleScheme(type, props.style ?? {});
    }
    
    React.useEffect(() => {
        if (!elemLink) return;
    
        const elem = elemLink.get({ noproxy: true });
        const props = elem?.props;
    
        if (!props || !props['data-id'] || !props['data-type']) return;
    
        const id = props['data-id'];
        const internalType = props['data-type'];
        const currentKey = `${id}-${type}`;
    
        if (copyDataContent.current?.key === currentKey) return;
    
        // Обновляем всё — новый элемент или режим
        copyDataContent.current = {
            key: currentKey,
            id,
            type,
        };
    
        const copyProps = sanitizeProps(props);
        setStory([copyProps]);
        setCurrent(copyProps);
        setFuture([]);
    
        const newSchema = createScheme(internalType, copyProps);
        setSchema(newSchema);
    }, [elemLink, type]);
    React.useEffect(() => {
        return () => useEdit.cancel();
    }, []);


    return(
        <motion.div
            style={{display:'flex', flexDirection: 'column'}}
            initial={{ opacity: 0 }}     // Начальная непрозрачность 0
            animate={{ opacity: 1 }}     // Конечная непрозрачность 1
            transition={{ duration: 1 }} // Плавное изменение за 1 секунду
        >
            <Form
                key={copyDataContent.current?.key}
                scheme={schema}
                labelPosition="column"
                onSpecificChange={(old, news)=> {
                    Object.entries(news).forEach(([key, value]) => useEdit(key, value))
                }}
            />
        </motion.div>
    );
}


/**
 * const useEdit = (key: string, newValue: string) => {
        const type = copyDataContent?.current?.type;
        
        if(type === 'props') setCurrent((prev) => {
            const next = { ...prev, [key]: newValue };
            useAddStory(next);
            onChange(next);
            return next;
        });
        // стили
        else {
            setSchema((schema)=> {
                const elem = elemLink.get({ noproxy: true });
                const find = schema.find(schema => schema.id === key);

                const unit = find?.unit === undefined ? '' : find.unit;
                useMergeObject('style', { [key]: newValue + unit });

                return schema;
            });
        }
    }
 */
/**
 * React.useEffect(() => {
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
                const schema = createScheme(elem.props['data-type'], copyProps);
                setSchema([]);
                setSchema(schema);
            }
        }
    }, [elemLink, type]);
 */