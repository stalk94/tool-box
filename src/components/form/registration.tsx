import React from 'react';
import { LabelLogin, LabelPassword, LabelEmail, LabelPhone, LabelSelect } from '../../components/input/labels.inputs';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { Person, Key, Tag, AlternateEmail } from '@mui/icons-material';
import { validateEmail, validateLogin, validatePass, validatePhone } from '../../app/verify.hooks';


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
    onRegistration?: (outScheme: Record<string, string|number>)=> void  
    button?: ButtonProps
}


// ? сделать error panel и блокировку отправки при non valid
// ? валидаторы вынести в глобал
export default function FormRegistration({ scheme, loading, onRegistration, button }: BaseFormProps) {
    const ref = React.useRef<Record<TypeSchema, boolean|string>>({password: true});
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
        console.log('click registaration', state);
        if(onRegistration) onRegistration(state);
    }
    const useChangeValue =(name: string, value: any)=> {
        console.log(name, value);

        setState((old)=> {
            old[name] = value;
            return old;
        });
    }
    const useTransform =(scheme: Schema[])=> {
        const shab = {}

        scheme.map((elem)=> {
            shab[elem.type] = '';
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