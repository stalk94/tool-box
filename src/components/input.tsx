import React from 'react';
import { Box, useTheme, IconButton, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { VisibilityOff, Visibility, FileCopy, Done, Close } from '@mui/icons-material';
import ButtonGroup from '@mui/material/ButtonGroup';



type BaseInputProps = {
    min?: number
    max?: number
    step?: number
    left?: any 
    right?: any 
    placeholder?: string
    children?: React.ReactNode
    variant: "fullWidth" | "inset" | "middle"
    onChange?: (value: string | number)=> void
    success: boolean
    borderStyle?: 'dashed' | 'solid' | 'dotted'
} & InputBaseProps
type PasswordInputProps = {

} & BaseInputProps



/**
 * Базовое поле ввода. На данный момент работает:
 * - number, text
 * * левый и правый сторона можно реализовать верефикатор индикатор а так же тул панель
 */
function BaseInput({ value, left, right, onChange, placeholder, variant, children, ...props }: BaseInputProps) {
    const [inputValue, setInputValue] = React.useState<number | string>();
    const theme = useTheme();
    const numberButtonStyle = {
        margin: 0,
        padding: 0,
        border: '1px dotted #dddada45'
    }

    const useFiltre =(value: string|number)=> {
        if(props.type === 'text' || props.type === 'number' || props.type === 'password') {
            if(props.type === 'number' && !isNaN(+value)) {
                setInputValue(+value);
                onChange && onChange(+value);
            }
            else {
                setInputValue(value);
                onChange && onChange(value);
            }
        }
    }
    const filteredProps =()=> {
        const clone = structuredClone(props);
        if(clone.type !== 'password') delete clone.type;
        return clone;
    }
    const handleIncrease =()=> {
        if (typeof inputValue === 'number' && inputValue < (props.max ?? 100)) {
            const newValue = inputValue + (props.step ?? 1);
            setInputValue(newValue);
            onChange && onChange(newValue);
        }
    }
    const handleDecrease =()=> {
        if (typeof inputValue === 'number' && inputValue > (props.min ?? 0)) {
            const newValue = inputValue - (props.step ?? 1);
            setInputValue(newValue);
            onChange && onChange(newValue);
        }
    }
    const chek =()=> {
        const border = props?.borderStyle ?? 'solid';

        if(props.error) return `1px ${border} ${theme.palette.error.light}`;
        else if(props.disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else if(props.success) return `1px ${border} ${theme.palette.success.light}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }
    React.useEffect(()=> {
        if(props.type === 'number') {
            if(typeof value !== 'number') setInputValue(0);
            else setInputValue(value);
        }
    }, [props.type]);

   
    return(
        <Paper
            style={{ 
                opacity: props.disabled && 0.6,
                display: 'flex', 
                alignItems: 'center', 
                border: chek(),
                boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)'
            }}
        >
            { left && 
                <React.Fragment>
                    { left }
                    <Divider flexItem orientation="vertical" variant={'middle'} />
                </React.Fragment>
            }
            
            <InputBase 
                value={inputValue}
                sx={{ flex: 1, fontSize: '18px' }}
                placeholder={placeholder}
                inputProps={{
                    style: {
                        textAlign: 'center'
                    }
                }}
                onChange={(e)=> useFiltre(e.target.value)}
                {...filteredProps()}
            />
         
            { right && props.type !== 'number' &&
                <React.Fragment>
                    { variant !== null && <Divider flexItem orientation="vertical" variant={variant} /> }
                    { right }
                </React.Fragment>
            } 
            { props.type === 'number' &&
                <ButtonGroup orientation="vertical">
                    <Button 
                        variant='text' 
                        color='inherit' 
                        onClick={handleIncrease} 
                        disabled={inputValue <= props.min}
                        style={numberButtonStyle}
                    >
                        +
                    </Button>
                    <Button 
                        variant='text' 
                        color='inherit' 
                        onClick={handleDecrease} 
                        disabled={inputValue >= props.max}
                        style={numberButtonStyle}
                    >
                        −
                    </Button>
                </ButtonGroup>
            }
        </Paper>
    );
}
/**
 * Наследник BaseInput, конкретно ввода для паролей
 * ? сделать верификаторы
 */
function PasswordInput({ value, onChange, placeholder, ...props }: PasswordInputProps) {
    const [type, setType] = React.useState<'password'|'text'>('password');


    return(
        <BaseInput
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            type={type}
            right={
                <IconButton 
                    onClick={()=> {
                        setType((old)=> old === 'password' ? 'text' : 'password')
                    }} 
                    color="default" 
                    sx={{ p: '10px' }}
                >
                    { type !== 'password' 
                        ? <VisibilityOff style={{color:'gray'}} /> 
                        : <Visibility style={{color:'gray'}}/>
                    }
                </IconButton>
            }
            {...props}
        />
    );
}
function VerifyPaswordInput({onVerify, ...props}: {onVerify: any} & PasswordInputProps) {
    const theme = useTheme();
    const [verify, setVerify] = React.useState<boolean|null>(null);


    const left =()=> {
        return(
            <IconButton
                color="default"
                sx={{ p: '10px' }}
            >
                { (verify !== null && verify)
                    ? <Done style={{ color: theme.palette.success.dark }} />
                    : <Close style={{ color: theme.palette.error.dark }} />
                }
            </IconButton>
        );
    }
    // ? реализовать верификаторы 
    const useVerifyChange =(value: string)=> {
        if(value.length < 1) setVerify(false);
        else setVerify(true);
    }
    

    return(
        <PasswordInput {...props}
            error={verify !== null && !verify}
            left={left()}
            variant={null}
            onChange={useVerifyChange}
        />
    );
}

function ColorPicker({ value, variant, left, onChange, ...props }) {
    const [inputValue, setInputValue] = React.useState<string>(value);
    const theme = useTheme();

    const chek =()=> {
        const border = props?.borderStyle ?? 'solid';

        if(props.error) return `1px ${border} ${theme.palette.error.light}`;
        else if(props.disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else if(props.success) return `1px ${border} ${theme.palette.success.light}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }
    const useCopy =()=> {
        navigator.clipboard.writeText(inputValue);
    }
    const useFiltre =(value: string)=> {
        setInputValue(value);
        if(onChange) onChange(value);
    }


    return(
        <Paper
            style={{ 
                opacity: props.disabled && 0.6,
                display: 'flex', 
                alignItems: 'center', 
                border: chek(),
                boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)'
            }}
        >
            { left && 
                <React.Fragment>
                    <IconButton onClick={useCopy}>
                        <FileCopy />
                    </IconButton>
                    <Divider flexItem orientation="vertical" variant={variant??'middle'} />
                </React.Fragment>
            }
            <InputBase 
                //style={{color: inputValue}}
                placeholder={props.placeholder}
                type='text'
                value={inputValue}
                sx={{ flex: 1, fontSize: '18px' }}
                inputProps={{
                    style: {
                        textAlign: 'center'
                    }
                }}
                onChange={(e)=> useFiltre(e.target.value)}
            />
            <React.Fragment>
                {/**<Divider sx={{mr:'5px'}} flexItem orientation="vertical" variant={variant??'fullWidth'} />*/}
                <input
                    type="color"
                    value={inputValue}
                    onChange={(e)=> useFiltre(e.target.value)}
                    style={{
                        width: '15%',
                        height: '40px',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'transparent',
                        borderRadius: '5px',
                        marginRight: '3px'
                    }}
                />
            </React.Fragment>
        </Paper>
    )
}



export default {
    Input: BaseInput,
    PasswordInput,
    ColorPicker,
    VerifyPaswordInput
}