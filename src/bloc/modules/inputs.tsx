import React from 'react';
import { TextInput, NumberInput, PasswordInput, LoginInput, 
    DateInput, SliderInput, ToggleInput, SwitchInput, CheckBoxInput,
    SelectInput, AutoCompleteInput, FileInput
} from '../../index';
import { TextInputProps, NumberInputProps } from '../../index';
import { SxProps } from '@mui/material';
import { useEvent, useCtxBufer } from './utils/function';
import { triggerFlyFromComponent } from './utils/anim';
import { iconsList } from '../../components/tools/icons';


/**
 * ! присутствует много повторяешегося кода, устранить!
 */


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
            data-type='Number'
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

export const DateInputWrapper = (props: TextWrapperProps) => {
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
    console.log(props);

    return (
        <div 
            data-id={dataId}
            //data-type={props}
            style={{...style, width: '100%', display:'block'}}
        >
            <DateInput
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

export const SliderInputWrapper = (props: TextWrapperProps) => {
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
            data-type='Slider'
            style={{...style, width: '100%', display:'block', marginLeft:'35px'}}
        >
            <SliderInput
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

export const CheckBoxInputWrapper = (props: TextWrapperProps) => {
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
            data-type='CheckBox'
            style={{...style, width: '100%', display:'block', marginLeft:'35px'}}
        >
            <CheckBoxInput
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

export const SwitchInputWrapper = (props: TextWrapperProps) => {
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
            data-type='Switch'
            style={{...style, width: '100%', display:'block', marginLeft:'35px'}}
        >
            <SwitchInput
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

export const ToggleInputWrapper = (props: TextWrapperProps) => {
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
            data-type='ToggleButtons'
            style={{...style, width: '100%', display:'block', marginLeft:'35px'}}
        >
            <ToggleInput
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

export const SelectInputWrapper = (props: TextWrapperProps) => {
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
            data-type='Select'
            style={{...style, width: '100%', display:'block'}}
        >
            <SelectInput
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

export const AutoCompleteInputWrapper = (props: TextWrapperProps) => {
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
            data-type='AutoComplete'
            style={{...style, width: '100%', display:'block'}}
        >
            <AutoCompleteInput
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

export const FileInputWrapper = (props: TextWrapperProps) => {
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
            data-type='File'
            style={{...style, width: '100%', display:'block'}}
        >
            <FileInput
                labelSx={labelStyle}
                onUpload={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
}