import React from 'react';
import { alpha, IconButton, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import { InputBaseProps } from '@mui/material/InputBase';
import { InputPaper, InputBaseCustom  } from './atomize';
import { safeOmitInputProps } from '../hooks/omit';


export type BaseInputProps = {
    min?: number
    max?: number
    step?: number
    left?: any 
    right?: any 
    placeholder?: string
    label?: string
    children?: React.ReactNode
    onChange?: (value: string | number)=> void
    success?: boolean
    borderStyle?: 'dashed' | 'solid' | 'dotted'
    divider?: 'none' | 'dashed' | 'solid' | 'dotted'
} & InputBaseProps




export default function TextInput({ value, left, right, onChange, placeholder, variant, label, ...props }: BaseInputProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState<number | string>('');

    const useStyleIcon =()=> {
        const style = props?.styles?.icon;

        return style ?? {
            color: alpha(theme.palette.action.active, 0.5),
        }
    }
    const useFiltre =(value: string|number)=> {
        if(props.type === 'text' || props.type === 'number' || props.type === 'password') {
            if(props.type === 'number' && !isNaN(+value)) {
                setInputValue(+value);
                onChange && onChange(+value);
            }
            else if(props.type !== 'number' ) {
                setInputValue(value);
                onChange && onChange(value);
            }
        }
    }
    const filteredProps =()=> {
        const clone = safeOmitInputProps(props, [
            'borderStyle',
            'success',
            'toolVisible',
            'labelSx',
            'position',
            'diapasone',
            'markStep',
            'mark',
        ]);

        if(clone.type !== 'password') delete clone.type;
        return clone;
    }
    React.useEffect(()=> {
        if(value) setInputValue(value);
    }, [value]);
    
   
    return(
        <InputPaper {...props} >
            <IconButton
                disabled={props.disabled}
                sx={{
                    ...useStyleIcon(),
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                }}
            >
                { left }
                { props.divider!=='none' && 
                    <Divider 
                        flexItem 
                        orientation="vertical" 
                        variant='fullWidth' 
                        sx={{borderStyle: props.divider, pl:0.6}} /> 
                    }
            </IconButton>
           
            <InputBaseCustom
                value={inputValue}
                placeholder={placeholder}
                onChange={useFiltre}
                { ...filteredProps() }
            />

            {right &&
                <React.Fragment>
                    {variant || theme.mixins.input.variant &&
                        <Divider flexItem orientation="vertical" variant={variant ?? theme.mixins.input.variant} />
                    }
                    { right }
                </React.Fragment>
            }

        </InputPaper>
    );
}