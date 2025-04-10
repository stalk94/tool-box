import React from 'react';
import { LabelText, LabelNumber, LabelColor, LabelSlider, LabelSelect, LabelToogler, LabelDateOrTime } from '../input/labels.inputs';
import { SwitchInput, CheckBoxInput } from '../input/input.any';
import { Schema, TypeSchema } from './types';



export type FormProps = {
    scheme: Schema[]
    /** все данные форм при изменении данных */
    onChange?: (state: Record<string, any>)=> void
    /** показывает изменение конкретного значения инпута, старое => новое */
    onSpecificChange?: (old: Record<string, any>, news: Record<string, any>)=> void
    labelPosition?:  "left" | "right" | "column"
}


const FabricText =({ schema, multiline }: { schema: Schema<'text'>, multiline?: boolean })=> {
    return(
        <LabelText
            multiline={multiline}
            rows={multiline && 4}
            { ...schema }
        />
    );
}
const FabricNumber =({ schema }: { schema: Schema<'number'> })=> {
    return(
        <LabelNumber
            { ...schema }
        />
    );
}
const FabricColor =({ schema }: { schema: Schema<'color'> })=> {
    return(
        <LabelColor 
            { ...schema }
        />
    );
}
const FabricSlider =({ schema }: { schema: Schema<'slider'> })=> {
    return(
        <LabelSlider
            { ...schema }
        />
    );
}
const FabricSelect =({ schema }: { schema: Schema<'select'> })=> {
    return(
        <LabelSelect 
            { ...schema }
        />
    );
}
const FabricSwitch =({ schema }: { schema: Schema<'switch'> })=> {
    const idRef = React.useRef(`input-switch-${schema.id ?? Date.now()}`).current; 
    
    return(
        <SwitchInput
            id={idRef}
            { ...schema }
        />
    );
}
const FabricToogler =({ schema }: { schema: Schema<'toggle'> })=> {
    
    return(
        <LabelToogler
            { ...schema }
        />
    );
}
const FabricDate =({ schema }: { schema: Schema<'date'> })=> {
    return(
        <LabelDateOrTime
            isTimePicker={false}
            { ...schema }
        />
    );
}
const FabricTime =({ schema }: { schema: Schema<'time'> })=> {
    return(
        <LabelDateOrTime
            isTimePicker={true}
            { ...schema }
        />
    );
}
const FabricCheckBox =({ schema }: { schema: Schema<'checkbox'> })=> {
    return(
        <CheckBoxInput
            { ...schema }
        />
    );
}

////////////////////////////////////////////////////////////////////
const fabrics = {
    text: (schema)=> <FabricText schema={schema} />,
    number: (schema)=> <FabricNumber schema={schema} />,
    color: (schema)=> <FabricColor schema={schema} />,
    multiText: (schema)=> <FabricText schema={schema} multiline={true}/>,
    slider: (schema)=> <FabricSlider schema={schema} />,
    switch: (schema)=> <FabricSwitch schema={schema} />,
    toggle: (schema)=> <FabricToogler schema={schema} />,
    date: (schema)=> <FabricDate schema={schema} />,
    time: (schema)=> <FabricTime schema={schema} />,
    select: (schema)=> <FabricSelect schema={schema} />,
    checkbox: (schema)=> <FabricCheckBox schema={schema} />,
}
////////////////////////////////////////////////////////////////////


// todo: задокументировать
export default function Form({ scheme, onChange, onSpecificChange, labelPosition }: FormProps) {
    const stateRef = React.useRef<Record<string, any>>({});
    const [state, setState] = React.useState<Record<string, any>>({});          // первый рендер

    
    const useChek =(type: string)=> {
        if(fabrics[type]) return true;
        else console.warn(
            'Был передан тип неизвестной схемы %c%s', 
            'color: gray; font-style: italic;',
            `'${type}'`
        );
    }
    const getScheme =(id: string)=> {
        const find = scheme.find((elem)=> elem.id === id);
        return find;
    }
    const useChangeValue = React.useCallback((id: string, value: any) => {
        if(onSpecificChange) onSpecificChange(
            { [id]: structuredClone(stateRef.current[id]) },
            { [id]: value }
        );

        stateRef.current = { ...stateRef.current, [id]: value };
        onChange && onChange(stateRef.current);
    }, []);
    const useTransform =(scheme: Schema[])=> {
        const sbd = {};

        scheme.forEach((elem)=> {
            sbd[elem.id] = elem.value;
            if(labelPosition) elem.position = labelPosition;
        });

        stateRef.current = sbd;
        setState(sbd);
    }
    React.useEffect(()=> {
        useTransform(scheme);
    }, [scheme]);


    return(
        <React.Fragment>
            { state && Object.keys(state).map((keyName, index)=> {
                const element = getScheme(keyName);
                if(element) element.onChange =(value)=> useChangeValue(keyName, value);
                

                if(element?.type) return(
                    <React.Fragment key={index}>
                        { useChek(element.type) && fabrics[element.type](element) }
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
}