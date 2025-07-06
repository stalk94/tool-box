import React from "react";
export { TextInput, NumberInput, SliderInput } from '../components/input';
import { Form, Schema, AccordionForm, AccordionScnema } from '../index';
import { fabrickStyleScheme, stylesFabricScheme } from './config/utill';
import { motion } from 'framer-motion';
import { sanitizeProps } from './helpers/sanitize';
import { debounce, max } from 'lodash';
import { PropsForm, ProxyComponentName } from './type';
import { merge } from 'lodash';
import constructorScheme from './Constructor'; 



export default function({ type, elemLink, onChange }: PropsForm) {
    const copyDataContent = React.useRef({});                               // кэш во избежание перерендеров
    const [schema, setSchema] = React.useState<Schema[]>([]);
    const [acSchema, setAcSchema] = React.useState<AccordionScnema[]>([]);
    const [current, setCurrent] = React.useState<Record<string, any>>(null);


    const useMergeObject = (key: 'style'|'sx'|string, newValue: any) => {
        setCurrent((prev) => {
            const prevValue = prev[key] ?? {};
            const next = {
                ...prev,
                [key]: merge({}, prevValue, newValue)  // lodash.merge для глубокой сборки
            };
           
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
                    //useAddStory(next);
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
            const { schema } = constructorScheme(typeComponent, props);
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
        setCurrent(copyProps);
    
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
                        color: 'silver',
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