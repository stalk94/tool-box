import React from 'react';
import { LabelText, LabelNumber, LabelColor, LabelSlider, LabelSelect, LabelToogler, LabelDateOrTime } from '../../components/input/labels.inputs';
import { SwitchInput, CheckBoxInput } from '../input/input.any';
import { Schema, TypeSchema } from './interfaces.general';


type FormProps = {
    scheme: Schema[]
    onChange: (state: Record<string, any>)=> void
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


// форма (пока без кнопок на каждом поле)
export default function Form({ scheme, onChange }: FormProps) {
    const stateRef = React.useRef<Record<string, any>>({});
    const [state, setState] = React.useState<Record<string, any>>({});          // первый рендер

   
    const getScheme =(id: string)=> {
        const find = scheme.find((elem)=> elem.id === id);
        return find;
    }
    const useChangeValue = React.useCallback((id: string, value: any) => {
        stateRef.current = { ...stateRef.current, [id]: value };
        onChange(stateRef.current);

        //setState((old) => {
        //    const newState = { ...old, [id]: value };
        //    return newState;
        //});
    }, []);
    const useTransform =(scheme: Schema[])=> {
        const sbd = {};

        scheme.forEach((elem)=> {
            sbd[elem.id] = elem.value;
        });

        stateRef.current = sbd;
        setState(sbd);
    }
    React.useEffect(()=> {
        useTransform(scheme);
    }, [scheme]);


    return(
        <React.Fragment>
            { Object.keys(state).map((keyName, index)=> {
                const element = getScheme(keyName);
                if(element) element.onChange =(value)=> useChangeValue(keyName, value);
                

                if(element?.type) return(
                    <React.Fragment key={index}>
                        { fabrics[element.type](element) }
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
}