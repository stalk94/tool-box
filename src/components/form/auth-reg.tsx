import React from 'react';
import { LabelLogin, LabelPassword, LabelEmail, LabelPhone, LabelSelect } from '../input/labels.inputs';
import { Button, ButtonProps, CircularProgress, SxProps } from '@mui/material';
import { Person, Key, Tag, AlternateEmail } from '@mui/icons-material';
import { validateEmail, validateLogin, validatePass, validatePhone } from './validator-defolt';


export type TypeSchema = 'password' | 'password2' | 'login' | 'email' | 'phone' | 'select';
export type ValidatorCustom =(value: any)=> {
    result: boolean
    helperText?: string
}
export type Schema = {
    placeholder?: string 
    label?: string 
    type: TypeSchema
    sx: SxProps
}
export type BaseFormProps = {
    loading: boolean
    scheme: Schema[]
    onRegistration: (outScheme: Record<string, string|number>)=> void  
    button?: ButtonProps
    /** Кастомные валидаторы */
    validators?: Record<'password' | 'login' | 'email' | 'phone', ValidatorCustom>
}



export default function RegistrationForm({ scheme, loading, onRegistration, button, validators }: BaseFormProps) {
    const ref = React.useRef<Record<TypeSchema, boolean|string>>({});
    const [isValid, setIsValid] = React.useState(true);
    const [state, setState] = React.useState<Record<TypeSchema, any>>({});
    

    // совпадение пароля в confirm password форме
    const validateConfirmPass = (curentPassword: string, value: string) => {
        if (curentPassword !== value) {
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
    const handlerValidate =(type: TypeSchema, value: string)=> {
        let result: {result: boolean, helperText?: string} = {result: true};

        if(type === 'login') result = validators[type]?.(value) ?? validateLogin(value);
        else if(type === 'password') result = validators[type]?.(value) ?? validatePass(value);
        else if(type === 'email') result = validators[type]?.(value) ?? validateEmail(value);
        else if(type === 'phone') result = validators[type]?.(value) ?? validatePhone(value);

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


    return (
        <React.Fragment>
            { Object.keys(state).map((keyName, index) => {
                const element = getScheme(keyName);
                const type = keyName as TypeSchema;
                if (!element) return null;

                const commonProps = {
                    key: index,
                    position: 'column',     // ANCHOR - надо доработать
                    disabled: loading,
                    label: element.label,
                    placeholder: element.placeholder,
                    value: state[keyName],
                    sx: element.sx,
                    onChange: (val: any) => useChangeValue(keyName, val),
                };
                const validators = {
                    login: () => handlerValidate('login', state.login),
                    password: () => handlerValidate('password', state.password),
                    password2: () => validateConfirmPass(state.password, state.password2),
                    email: () => handlerValidate('email', state.email),
                    phone: () => handlerValidate('phone', state.phone),
                };

                const componentMap: Record<string, JSX.Element> = {
                    login: <LabelLogin {...commonProps} left={<Person />} useVerify={validators[type]} />,
                    password: <LabelPassword {...commonProps} left={<Key />} useVerify={validators[type]} />,
                    password2: <LabelPassword {...commonProps} left={<Key />} useVerify={validators[type]} />,
                    email: <LabelEmail {...commonProps} left={<AlternateEmail />} useVerify={validators[type]} />,
                    phone: <LabelPhone {...commonProps} left={<Tag />} useVerify={validators[type]} />,
                };

                return componentMap[keyName] ?? null;
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