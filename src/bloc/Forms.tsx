import React from "react";
export { TextInput, NumberInput, SliderInput } from '../components/input';
import { Form, Schema, AccordionForm, AccordionScnema } from '../index';
import { useTheme, Theme } from "@mui/material";
import { fabrickUnical, fabrickStyleScheme, stylesFabricScheme } from './config/utill';
import { motion } from 'framer-motion';
import { sanitizeProps } from './helpers/sanitize';
import { debounce, max } from 'lodash';
import { PropsForm, ProxyComponentName } from './type';
import { merge } from 'lodash';
import { Source, Bookmark, HMobiledata, Circle, CropSquare, Square } from "@mui/icons-material";


// составляет индивидуальную схему пропсов
const useCreateSchemeProp = (typeContent:ProxyComponentName, propName:string, propValue:any, theme) => {
    const textKeys = ['children', 'src', 'alt', 'sizes', 'placeholder', 'label'];
    const numberKeys = ['min', 'max', 'step', 'heightMedia', 'elevation'];
    const switchKeys = ['fullHeight', 'isDirectionColumn', 'showLabels', 'isChildren', 'isSecondary', 'isButton', 'autoplay'];
    //const fileKeys = [''];
    
    if(switchKeys.includes(propName)) {
        return {
            type: 'switch',
            id: propName,
            label: propName,
            labelSx: { fontSize: '14px' },
            value: propValue
        }
    }
    else if (propName === 'data-source') {
        propValue === 'table'
        return {
            type: 'file',
            id: 'file',
            label: 'upload',
            accept: propValue === 'table' && ".json,.csv,.xlsx,.xls",
            labelSx: { fontSize: '14px' },
            value: propValue,
        };
    }
    else if(numberKeys.includes(propName)) {
        return {
            type: 'number',
            id: propName,
            value: propValue,
            label: propName,
            labelSx: { fontSize: '14px' },
            max: propName==='elevation' ? 12 : propName==='heightMedia' && 500,
            step: propName==='elevation' ? 1 : propName==='heightMedia' && 20,
            sx: { fontSize: 14 }
        }
    }
    else if(textKeys.includes(propName)) {
        return {
            type: 'text',
            id: propName,
            multiline: true,
            value: propValue,
            label: propName,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
    else return fabrickUnical(propName, propValue, theme, typeContent);
}
const useFabrickSchemeProps = (typeComponent: ProxyComponentName, props: Record<string, any>, theme: Theme) => {
    const result = {
        schema: [{
            type: 'switch',
            id: 'fullWidth',
            label: 'fullWidth',
            labelSx: { fontSize: '14px' },
            value: props?.fullWidth
        }], 
        acSchema: []
    };
    const specific = ['Avatar'];

    
    if(!specific.includes(typeComponent)) Object.keys(props).forEach((propsName) => {
        const value = props[propsName];
        

        // проп массив либо обьект
        if (typeof value === 'object') {
            //console.log(propsName, value);
        }
        // проп является элементарным типом
        else if(propsName !== 'fullWidth') {
            const schema = useCreateSchemeProp(
                typeComponent,
                propsName,
                value,
                theme
            );

            if (schema) result.schema.push(schema);
        }
    });
    else {
        //"circular" | "rounded" | "square"
        result.schema.push({
            type: 'number',
            id: 'sizes',
            value: props.sizes,
            min: 24,
            label: 'sizes',
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }, {
            type: 'toggle',
            id: 'variant',
            items: [
                { id: 'circular', label: <Circle/> },
                { id: 'rounded', label: <CropSquare/> },
                { id: 'square', label: <Square/> },
            ],
            label: 'variant',
            value: props?.variant ?? 'circular',
            labelSx: { fontSize: '14px' }
        }, {
            type: 'toggle',
            id: 'data-source',
            items: [
                { id: 'src', label: <Source /> },
                { id: 'icon', label: <Bookmark /> },
                { id: 'children', label: <HMobiledata /> }
            ],
            label: 'data-source',
            value: props['data-source'],
            labelSx: { fontSize: '14px' }
        });

        result.schema.push({
            type: 'text',
            id: 'src',
            multiline: true,
            label: 'src',
            labelSx: { fontSize: '14px' },
            value: props.src,
        });
        result.schema.push({
            type: 'file',
            id: 'file',
            label: 'upload',
            labelSx: { fontSize: '14px' },
            value: props.src,
        });
        result.schema.push({
            type: 'text',
            multiline: true,
            id: 'children',
            label: 'children',
            labelSx: { fontSize: '14px' },
            value: props.children,
        });
        result.schema.push(fabrickUnical('icon', props.icon, theme, 'Avatar'));
    }
    
    return result;
}



export default function({ type, elemLink, onChange }: PropsForm) {
    const theme = useTheme();
    const copyDataContent = React.useRef({});                               // кэш во избежание перерендеров
    const [schema, setSchema] = React.useState<Schema[]>([]);
    const [acSchema, setAcSchema] = React.useState<AccordionScnema[]>([]);
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
    const useMergeObject = (key: 'style'|'sx'|string, newValue: any) => {
        setCurrent((prev) => {
            const prevValue = prev[key] ?? {};
            const next = {
                ...prev,
                [key]: merge({}, prevValue, newValue)  // lodash.merge для глубокой сборки
            };
            useAddStory(next);
            onChange(next);
            return next;
        });
    }
    const useEdit = React.useCallback(
        debounce((key: string, newValue: string, keyProps?: string) => {
            const type = copyDataContent?.current?.type;        // тип вкладки редактора

            if (type === 'props') {
                if(keyProps) {
                    const targetSection = acSchema.find(section => section.id === keyProps);
                    const find = targetSection?.scheme?.find((s) => s.id === key);
                    const unit = find?.unit ?? '';
                    useMergeObject(keyProps, { [key]: newValue + unit  });
                }
                else setCurrent((prev) => {
                    const next = { ...prev, [key]: newValue };
                    useAddStory(next);
                    onChange(next);
                    return next;
                });
            } 
            else if(type === 'styles' && keyProps) {
                const targetSection = acSchema.find(section => section.id === keyProps);
                const find = targetSection?.scheme?.find((s) => s.id === key);
                const unit = find?.unit ?? '';
                useMergeObject('styles', {
                    [keyProps]: {
                        ...(current?.styles?.[keyProps] ?? {}),
                        [key]: newValue + unit
                    }
                });
            }
            else {
                setSchema((schema) => {
                    const find = schema.find((s) => s.id === key);
                    const unit = find?.unit ?? '';
                    useMergeObject('style', { [key]: newValue + unit });
                    return schema;
                });
            }
        }, 250),
        [elemLink, onChange]
    );
    const createScheme = (typeComponent: ProxyComponentName, props: Record<string, any>) => {
        if(type === 'props') {
            const { schema } = useFabrickSchemeProps(typeComponent, props, theme);
            setSchema(schema);
            setAcSchema([]);
        }
        else if(type === 'styles') {
            setSchema([]);
            setAcSchema([...stylesFabricScheme(typeComponent, props.styles ?? {})]);
        }
        else {
            const curSchema = fabrickStyleScheme(type, props.style ?? {});
            setSchema(curSchema);
            setAcSchema([]);
        }
    }

    React.useEffect(() => {
        if (!elemLink) return;
    
        const elem = elemLink.get();
        const props = elem?.props;
    
        if (!props || !props['data-id'] || !props['data-type']) return;
        if (!elem || !elem.props || !elem.props['data-id']) return null;
    
        const id = props['data-id'];
        const internalType = props['data-type'];
        const currentKey = `${id}-${type}`;
    
        if (copyDataContent.current?.key === currentKey) return;
    
        // Обновляем всё — новый элемент или режим
        copyDataContent.current = {
            key: currentKey,
            id,
            type,
            'data-type': internalType
        };
    
        const copyProps = sanitizeProps(props);
        setStory([copyProps]);
        setCurrent(copyProps);
        setFuture([]);
    
        createScheme(internalType, copyProps);
    }, [elemLink, type]);
    React.useEffect(() => {
        return () => useEdit.cancel();
    }, []);
    

    return(
        <motion.div
            className="FORM"
            style={{display:'flex', flexDirection: 'column'}}
            initial={{ opacity: 0 }}     // Начальная непрозрачность 0
            animate={{ opacity: 1 }}     // Конечная непрозрачность 1
            transition={{ duration: 1 }} // Плавное изменение за 1 секунду
        >
            { schema[0] &&
                <Form
                    key={`form-${copyDataContent.current?.key}`}
                    scheme={schema}
                    labelPosition="column"
                    onSpecificChange={(old, news)=> {
                        Object.entries(news).forEach(([key, value]) => useEdit(key, value))
                    }}
                />
            }
            { acSchema[0] &&
                <AccordionForm
                    activeIndex={[0]}
                    key={`accordion-${copyDataContent.current?.key}`}
                    scheme={acSchema}
                    labelPosition="column"
                    headerStyle={{
                        fontSize: '12px',
                        color: 'orange',
                        paddingLeft: '14px',
                    }}
                    onSpecificChange={(old, news, keyProps: string)=> {
                        Object.entries(news).forEach(([key, value]) => useEdit(key, value, keyProps))
                    }}
                />
            }
        </motion.div>
    );
}