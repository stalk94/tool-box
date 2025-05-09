import React from "react";
export { TextInput, NumberInput, SliderInput } from '../components/input';
import { Form, Schema, AccordionForm, AccordionScnema } from '../index';
import { useTheme, Theme } from "@mui/material";
import { fabrickUnical, fabrickStyleScheme, stylesFabricScheme } from './config/utill';
import { motion } from 'framer-motion';
import { sanitizeProps } from './utils/sanitize';
import { debounce, max } from 'lodash';
import { PropsForm, ProxyComponentName } from './type';
import { merge } from 'lodash';


// составляет индивидуальную схему пропсов
const useCreateSchemeProp = (typeContent:ProxyComponentName, propName:string, propValue:any, theme) => {
    const textKeys = ['children', 'src', 'alt', 'sizes', 'placeholder', 'label'];
    const numberKeys = ['min', 'max', 'step', 'heightMedia'];
    const switchKeys = ['fullWidth', 'fullHeight'];
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
        return {
            type: 'file',
            id: 'file',
            label: 'upload',
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
            max: propName==='heightMedia' && 500,
            step: propName==='heightMedia' && 20,
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
    const result = { schema: [], acSchema: [] };

    Object.keys(props).forEach((propsName) => {
        const value = props[propsName];

        // проп массив либо обьект
        if (typeof value === 'object') {
            //console.log(propsName, value);
        }
        // проп является элементарным типом
        else {
            const schema = useCreateSchemeProp(
                typeComponent,
                propsName,
                value,
                theme
            );

            if (schema) result.schema.push(schema);
        }
    });

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
            const { schema, acSchema } = useFabrickSchemeProps(typeComponent, props, theme);
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
    
        const elem = elemLink.get({ noproxy: true });
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
                    onSpecificChange={(old, news, keyProps: string)=> {
                        Object.entries(news).forEach(([key, value]) => useEdit(key, value, keyProps))
                    }}
                />
            }
        </motion.div>
    );
}


/**
 * const schema: Schema[] = [];

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
        //const type = fabrickPropsScheme(typeContent, propsElem.type, 'type');
        const size = fabrickPropsScheme(typeContent, propsElem.size, 'size');
        const startIcon = fabrickPropsScheme(typeContent, propsElem.startIcon, 'startIcon');
        const endIcon = fabrickPropsScheme(typeContent, propsElem.endIcon, 'endIcon');
        color.items = getColors(theme);

        schema.push(
            children as Schema<'text'>,
            //type as Schema<'toggle'>,
            fullWidth as Schema<'switch'>,
            variant as Schema<'select'>,
            size as Schema<'toggle'>,
            color as Schema<'toggle'>,
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
    else if (typeContent === 'TextInput') {
        const left = fabrickPropsScheme(typeContent, propsElem.leftIcon, 'icon');
        const label = fabrickPropsScheme(typeContent, propsElem.label, 'children');
        const placeholder = fabrickPropsScheme(typeContent, propsElem.label, 'children');
        const position = fabrickPropsScheme(typeContent, propsElem.position, 'labelPosition');
        const fullWidth = fabrickPropsScheme(typeContent, propsElem.fullWidth, 'fullWidth');
        
    }
    
    return schema;
 */