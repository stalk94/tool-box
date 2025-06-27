import React from 'react';
import { alpha, IconButton, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import { InputPaper, InputBaseCustom  } from './atomize';
import { safeOmitInputProps } from '../hooks/omit';
import type { TextInputProps } from './type';



export default function TextInput({ value, left, right, onChange, placeholder, variant, label, ...props }: TextInputProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState<number | string>('');


    const styleIcon = React.useMemo(()=> {
        const style = props?.styles?.icon;

        return style ?? {
            color: alpha(theme.palette.action.active, 0.5),
        }
    }, []);
    const useFiltre = React.useCallback((value: string | number) => {
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
    }, []);
    const filteredProps = React.useMemo(()=> {
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
    }, [props]);
    React.useEffect(()=> {
        if (typeof window === 'undefined') return;
        
        if(value && value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);
    
   
    return(
        <InputPaper {...props} >
            <IconButton
                disabled={props.disabled}
                sx={{
                    ...styleIcon,
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                }}
            >
                { left }
                { props.divider !== 'none' && 
                    <Divider 
                        flexItem 
                        orientation="vertical" 
                        variant='fullWidth' 
                        sx={{
                            borderStyle: props.divider, 
                            pl: 0.6
                        }} 
                    /> 
                    }
            </IconButton>
           
            <InputBaseCustom
                value={inputValue}
                placeholder={placeholder}
                onChange={useFiltre}
                { ...filteredProps }
            />

            {right &&
                <React.Fragment>
                    {variant  &&
                        <Divider 
                            flexItem 
                            orientation="vertical" 
                            variant={variant} 
                        />
                    }
                    { right }
                </React.Fragment>
            }

        </InputPaper>
    );
}