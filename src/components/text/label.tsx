import React from 'react';
import { Box, InputLabel } from '@mui/material';
import type { SxProps, Theme, InputLabelProps as InputLabelP } from '@mui/material';


export type InputTupe = 'text' 
    | 'password' 
    | 'number' 
    | 'color' 
    | 'phone' 
    | 'email' 
    | 'date' 
    | 'time' 
    | 'login' 
    | 'select' 
    | 'slider'
    | 'toggle'
    | 'autocomplete'
    | 'file-combo'
    | 'file';
    
type InputCustomLabelProps = {
    label: React.ReactNode
    position?: 'left' | 'right' | 'column'
    typeInput?: InputTupe
    children: React.ReactElement
    styles?: any
    sx?: SxProps<Theme>
    id?: string | number
}
export type InputLabelProps = InputLabelP & {
    styles?: {
        label?: React.CSSProperties
    }
}


function Label({ id, children, styles, sx }: InputLabelProps) {
    //const theme = useTheme();

    const transform =()=> {
        if(styles?.label?.fontSize) {
            if(Number.isFinite(+styles?.label?.fontSize)) styles.label = {
                ...styles.label,
                fontSize: +styles.label.fontSize
            }
        }
        return styles?.label;
    }

    
    return (
        <InputLabel
            htmlFor={id}
            sx={{
                ml: 1,
                mt: 'auto',
                mb: 'auto',
                opacity: 0.9,
                //color: theme.palette.text.secondary,
                fontFamily: '"Roboto Condensed", Arial, sans-serif',
                ...sx,
                //...transform()
            }}
        >
            { children }
        </InputLabel>
    );
}


export default function LabelInput({ label, position, typeInput, children, sx, id, styles }: InputCustomLabelProps) {
    const idRef = React.useRef(`input-${typeInput}-${id ?? Date.now()}`).current;       // можно отслеживать
    
    return(
        <Box sx={{mt: 1.5}}
            display="flex" 
            flexDirection={(position==='left' || position==='right') ? 'row' : 'column'} 
        >
            { position === 'left' && 
                <Label 
                    id={idRef}
                    children={label} 
                    sx={{
                        flex: 0.7,
                        mr: 0,
                        fontSize: 18,
                        ...sx
                    }}
                />
            }
            { position === 'column' && 
                <Label 
                    id={idRef}
                    children={label} 
                    styles={styles}
                    sx={{
                        flex: 1,
                        ml: 0.5,
                        fontSize: 18,
                        mb: 0.5,
                        ...sx
                    }}
                />
            }
            <Box sx={{ flex: 2 }}>
                { React.cloneElement(children, { id: idRef }) }
            </Box>

            { position === 'right' && 
                <Label 
                    id={idRef} 
                    children={label}
                    sx={{
                        flex: 1,
                        ml: 2,
                        fontSize: 20,
                        ...sx
                    }}
                />
            }
        </Box>
    );
}