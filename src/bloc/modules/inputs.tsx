import React from 'react';
import { TextInput, NumberInput, PasswordInput, LoginInput,  } from '../../index';
import { TextInputProps, NumberInputProps } from '../../index';
import { SxProps } from '@mui/material';
import { useEvent, useCtxBufer } from './utils/function';
import { triggerFlyFromComponent } from './utils/anim';
import { iconsList } from '../../components/tools/icons';


type TextWrapperProps = TextInputProps & {
    'data-id': number
    labelStyle?: SxProps
    functions: Record<string, string>,
    startIcon?: string
}


export const TextInputWrapper = (props: TextWrapperProps) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    
    const emiter = useEvent(dataId);
    const storage = useCtxBufer(dataId, otherProps.value);
    const StartIcon = startIcon && iconsList[startIcon] ? iconsList[startIcon] : null;
    //console.log(style);

    return (
        <div 
            data-id={dataId}
            data-type='TextInput'
            style={{...style, width: '100%', display:'block'}}
        >
            <TextInput
                left={StartIcon ? <StartIcon/> : null}
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
}


export const NumberInputWrapper = (props: TextWrapperProps) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = useEvent(dataId);
    const storage = useCtxBufer(dataId, otherProps.value);
    //console.log(style);

    return (
        <div 
            data-id={dataId}
            data-type='NumberInput'
            style={{...style, width: '100%', display:'block'}}
        >
            <NumberInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
}