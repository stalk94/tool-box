import React from 'react';
import { TextInput, CheckBoxInput, NumberInput, SelectInput, Modal } from '../../../index';
import { FieldType } from '../helpers/format';
import { Button } from '@mui/material';


type FieldValueMap = {
    string: string
    url: string
    number: number
    boolean: boolean
    date: string
    object: object      //! 
    array: []           //!
    unknown: undefined | null
}
type Props<T extends FieldType> = {
    type: T;
    value: FieldValueMap[T];
    onChange: (newValue: FieldValueMap[T]) => void;
}


export default function<T extends FieldType>({ type, value, onChange }: Props<T>) {
    const cacheValue =  React.useRef<T>(value);
    const textStyle: React.CSSProperties = {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        background: 'none',
        color: 'orange',
        maxWidth: 100,
        textAlign: 'center',
    }

    const useChange =(value: any)=> {
        if(cacheValue.current !== value) onChange(value);
    }
    const handleStringChange = (val: string) => useChange(val as FieldValueMap[T]);
    const handleNumberChange = (val: string) => useChange(Number(val) as FieldValueMap[T]);
    const handleBooleanChange = (val: boolean) => useChange(val as FieldValueMap[T]);


    if (type === 'boolean') {
        return (
            <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => handleBooleanChange(e.target.checked)}
            />
        );
    }
    if (type === 'number') {
        return (
            <input
                type="number"
                style={{...textStyle, color: 'blueviolet'}}
                value={String(value)}
                onChange={(e) => handleNumberChange(e.target.value)}
            />
        );
    }
    if (type === 'date') {
        return (
            <input
                type="date"
                value={String(value).slice(0, 10)}
                onChange={(e) => handleStringChange(e.target.value)}
            />
        );
    }
    if (type === 'string' || type === 'url') {
        return (
            <input
                type="text"
                style={textStyle}
                value={String(value)}
                onChange={(e) => handleStringChange(e.target.value)}
            />
        );
    }
    // Пока что object и array только отображаем
    if (type === 'object' || type === 'array') {
        return (
            <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(value, null, 2)}
            </pre>
        );
    }

    return(
        <input
            style={textStyle}
            value={value}
            onChange={(e)=> useChange(e.target.value)}
        />
    );
}



export function FormAddColumn({ setClose }) {
    const types = ["string", "number", "boolean", "object", "url", "date", "array"];
    const [name, setName] = React.useState('');
    const [type, setType] = React.useState('string');

    const useSetClose = React.useCallback(() => setClose({
        key: name,
        type: type
    }), [type, name]);


    return(
        <Modal
            open={true}
            setOpen={()=> setClose(false)}
        >
            <div style={{display: 'flex', flexDirection:'column'}}>
                <TextInput
                    labelSx={{fontSize:12}}
                    label='column name'
                    position='left'
                    value={name}
                    onChange={setName}
                />
                <SelectInput
                    label='type'
                    position='left'
                    labelSx={{fontSize:12}}
                    onChange={(e)=> setType(e.id)}
                    value={type}
                    items={types.map((type)=> ({
                        id: type,
                        label: type
                    }))}
                />
                <Button 
                    disabled={name.length < 3}
                    variant='outlined'
                    color='success'
                    sx={{
                        mt: 1
                    }}
                    onClick={()=> useSetClose()}
                >
                    add column
                </Button>
            </div>
        </Modal>
    );
}