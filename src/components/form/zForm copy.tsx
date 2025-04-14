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


import React from 'react';
import { LabelLogin, LabelPassword, LabelEmail, LabelPhone, LabelSelect } from '../../components/input/labels.inputs';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { Person, Key, Tag, AlternateEmail } from '@mui/icons-material';
import { validateEmail, validateLogin, validatePass, validatePhone } from '../../app/verify';


//? еше надо выбор из двух варриантов
export type TypeSchema = 'password' | 'password2' | 'login' | 'email' | 'phone' | 'select';
export type Schema = {
    placeholder?: string 
    label?: string 
    type: TypeSchema
}
export type BaseFormProps = {
    loading: boolean
    scheme: Schema[]
    onRegistration: (outScheme: Record<string, string|number>)=> void  
    button?: ButtonProps
}


export default function RegistrationForm({ scheme, loading, onRegistration, button }: BaseFormProps) {
    const ref = React.useRef<Record<TypeSchema, boolean|string>>({});
    const [isValid, setIsValid] = React.useState(true);
    const [state, setState] = React.useState<Record<TypeSchema, any>>({});

    
    // совпадение пароля в confirm password форме
    const validateConfirmPass = (curentPassword: string, value: string) => {
        if(curentPassword !== value) {
            setIsValid(false);

            return {
                result: false,
                helperText: 'The passwords do not match'
            }
        }
        else {
            setIsValid(true);

            return {
                result: true
            }
        }
    }
    // вызов валидаторов
    const handlerValidate =(type: TypeSchema, value: any)=> {
        let result: {result: boolean, helperText?: string} = {result: true};

        if(type === 'login') result = validateLogin(value);
        else if(type === 'password') result = validatePass(value);
        else if(type === 'email') result = validateEmail(value);
        else if(type === 'phone') result = validatePhone(value);

        if(ref.current) {
            if(result.result && ref.current[type]) delete ref.current[type];
            else if(!result.result) ref.current[type] = result.helperText ?? true;
        }


        return result;
    }

    const getScheme =(type: TypeSchema)=> {
        const find = scheme.find((elem)=> elem.type === type);
        return find;
    }
    const handlerClickRegistartation =()=> {
        onRegistration(state);
    }
    const useChangeValue =(name: string, value: any)=> {
        setState((old) => ({ ...old, [name]: value }));
    }
    const useTransform =(scheme: Schema[])=> {
        const shab = {}

        scheme.map((elem)=> {
            shab[elem.type] = '';
            ref.current[elem.type] = true;
        });

        setState(shab);
    }
    React.useEffect(()=> {
        useTransform(scheme);

        const timer = setInterval(()=> {
            if(ref.current) {
                const result = Object.values(ref.current).find((elem)=> elem);
                setIsValid(!Boolean(result));
            }
            //console.log(ref.current)
        }, 500);

        return ()=> {
            clearInterval(timer);
        }
    }, []);


    return(
        <React.Fragment>
            { Object.keys(state).map((keyName, index)=> {
                const element = getScheme(keyName);

                if(keyName === 'login') return (
                    <LabelLogin  
                        key={index}
                        position='column'
                        disabled={loading}
                        label={element?.label ?? 'Login'}
                        placeholder={element?.placeholder}
                        left={<Person />}
                        value={state.login}
                        useVerify={(value)=> handlerValidate('login', value)}
                        onChange={(val)=> useChangeValue('login', val)}
                    />
                );
                else if(keyName === 'password') return (
                    <LabelPassword 
                        key={index}
                        position='column'
                        disabled={loading}
                        label={element?.label ?? 'Password'}
                        left={<Key />}
                        placeholder={element?.placeholder ?? 'min 6 simbol'}
                        value={state.password}
                        useVerify={(value)=> handlerValidate('password', value)}
                        onChange={(val)=> useChangeValue('password', val)}
                    />
                );
                else if(keyName === 'password2') return (
                    <LabelPassword 
                        key={index}
                        position='column'
                        disabled={loading}
                        label={element?.label ?? 'Confirm password'}
                        left={<Key />}
                        placeholder={element?.placeholder ?? 'min 6 simbol'}
                        value={state.password2}
                        useVerify={(value)=> validateConfirmPass(state.password, value)}
                        onChange={(val)=> useChangeValue('password2', val)}
                    />
                );
                else if(keyName === 'email') return (
                    <LabelEmail  
                        key={index}
                        disabled={loading}
                        position='column'
                        label={element?.label ?? 'Email'}
                        placeholder={element?.placeholder ?? 'test@mymail.com'}
                        value={state.email}
                        useVerify={(value)=> handlerValidate('email', value)}
                        onChange={(val)=> useChangeValue('email', val)}
                    />
                );
                else if(keyName === 'phone') return (
                    <LabelPhone  
                        key={index}
                        disabled={loading}
                        position='column'
                        label={element?.label ?? 'Phone number'}
                        placeholder={element?.placeholder}
                        value={state.phone}
                        useVerify={(value)=> handlerValidate('phone', value)}
                        onChange={(val)=> useChangeValue('phone', val)}
                    />
                );
            })}

            {/* кнопка регистрации */}
            <Button sx={{ mt: 2 }}
                variant='outlined'
                color='success'
                disabled={!isValid || loading} 
                onClick={handlerClickRegistartation}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                { ...button }
            />
        </React.Fragment>
    );
}