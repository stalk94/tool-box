import React from 'react';
import { Schema } from './types';
import { fabricsInput } from './fabrics';

export type FormProps = {
    scheme: Schema[]
    /** все данные форм при изменении данных */
    onChange?: (state: Record<string, any>)=> void
    /** показывает изменение конкретного значения инпута, старое => новое */
    onSpecificChange?: (old: Record<string, any>, news: Record<string, any>)=> void
    /** единый алиас на позицию лейблов инпутов (что бы каждому в ручную не прописывать)   */
    labelPosition?:  "left" | "right" | "column"
}



/**
 * `onChange` - весь список формы получить по изменению значения ввода любого инпута        
 * `onSpecificChange` - получить только тот который обновился а так же его предыдушее значение     
 * `labelPosition` - единый алиас на позицию лейблов инпутов (что бы каждому в ручную не прописывать)         
 *  @example scheme: [
 *      { type: 'text', id: 'test', placeholder: 'placeholder', label: 'test', position: 'column', left: <AccountBox/> },
 *      { type: 'number', id: 'test2', label: 'test', position: 'column', left: <Calculate/> },
 *      { type: 'color', id: 'test3', label: 'test', position: 'column' },
 *      { type: 'select', id: 'test4', label: 'test', position: 'column', items: [{ id:'1', label:'test' },...]},
 *      { type: 'toggle', id: 'test7', label: 'test', position: 'column', items: [{ id:'1', label:'test' },...]},
 *      { type: 'slider', id: 'test5', label: 'test', position: 'column' },
 *      { type: 'switch', id: 'test6', label: 'Включить свет', position: 'column' },
 *      { type: 'checkbox', id: 'test8', label: 'Принять' },
 * ]
 */
export default function Form({ scheme, onChange, onSpecificChange, labelPosition }: FormProps): React.JSX.Element {
    const [state, setState] = React.useState<Record<string, any>>({});

    const handleChange = React.useCallback((id: string, newValue: any) => {
        setState(prev => {
            const updated = { ...prev, [id]: newValue };
            onChange?.(updated);
            onSpecificChange?.({ [id]: prev[id] }, { [id]: newValue });
            return updated;
        });
    }, [onChange, onSpecificChange]);
    React.useEffect(() => {
        const initialState: Record<string, any> = {};
        scheme.forEach((field) => {
            initialState[field.id] = field.value;
        });
        setState(initialState);
    }, [scheme]);


    return(
        <>
            {scheme.map((field) => {
                if (!fabricsInput[field.type]) {
                    console.warn(`Неизвестный тип поля: ${field.type}`);
                    return null;
                }

                const finalField = {
                    ...field,
                    value: state[field.id],
                    onChange: (val: any) => handleChange(field.id, val),
                    position: field.position ?? labelPosition,
                };

                return (
                    <React.Fragment key={field.id}>
                        { fabricsInput[field.type](finalField) }
                    </React.Fragment>
                );
            })}
        </>
    );
}