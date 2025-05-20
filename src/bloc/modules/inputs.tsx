import React from 'react';
import { TextInput, NumberInput, PasswordInput, LoginInput, 
    DateInput, SliderInput, ToggleInput, SwitchInput, CheckBoxInput,
    SelectInput, AutoCompleteInput, FileInput
} from '../../index';
import { TextInputProps, NumberInputProps } from '../../index';
import { SxProps } from '@mui/material';
import { useEvent, useCtxBufer } from './utils/shared';
import { triggerFlyFromComponent } from './utils/anim';
import { iconsList } from '../../components/tools/icons';
import render, { sliderRender } from './export/Inputs';



type InputStyles = {
    form?: {
        borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none'
        borderColor?: string | 'none'
        background?: string | 'none'
    }
    placeholder?: React.CSSProperties
    label?: React.CSSProperties
    icon?: React.CSSProperties
}
type TextWrapperProps = TextInputProps & {
    'data-id': number
    labelStyle?: SxProps
    functions: Record<string, string>,
    leftIcon?: string,
    label?: string,
    position: 'left' | 'right' | 'column'
    width: string | number
    styles?: InputStyles
}


// styles 
export const TextInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        leftIcon,
        style,
        width,
        fullWidth,
        styles,
        ...otherProps
    } = props;
    
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const LeftIcon = leftIcon && iconsList[leftIcon] ? iconsList[leftIcon] : null;

    degidratationRef.current = (call) => {
        const code = render(
            'text',
            leftIcon,
            {...style, width: '100%', display:'block'},
            labelStyle,
            styles,
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);
    

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='TextInput'
            style={{...style, width: '100%', display:'block'}}
        >
            <TextInput
                left={LeftIcon ? <LeftIcon/> : null}
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                styles={styles}
                {...otherProps}
            />
        </div>
    );
});

export const NumberInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        styles,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);

    degidratationRef.current = (call) => {
        const code = render(
            'number',
            undefined,
            {...style, width: '100%', display:'block'},
            labelStyle,
            styles,
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);


    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='Number'
            style={{...style, width: '100%', display:'block'}}
        >
            
            <NumberInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                styles={styles}
                {...otherProps}
            />
        </div>
    );
});

export const DateInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
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
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
   
    degidratationRef.current = (call) => {
        const code = render(
            'date',
            undefined,
            {...style, width: '100%', display:'block'},
            labelStyle,
            {},
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);
    
    
    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type={props['data-type']}
            style={{...style, width: '100%', display:'block'}}
        >
            <DateInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const SliderInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        leftIcon,
        rightIcon,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const LeftIcon = leftIcon && iconsList[leftIcon] ? iconsList[leftIcon] : null;
    const RightIcon = rightIcon && iconsList[rightIcon] ? iconsList[rightIcon] : null;

    degidratationRef.current = (call) => {
        const code = sliderRender(
            leftIcon,
            rightIcon,
            {...style, width: '100%', display:'block'},
            labelStyle,
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);


    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='Slider'
            style={{marginLeft:'5px', ...style, width: '100%', display:'block'}}
        >
            <SliderInput
                labelSx={labelStyle}
                start={LeftIcon ? <LeftIcon/> : null}
                end={RightIcon ? <RightIcon/> : null}
                onChange={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const CheckBoxInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const [state, setState] = React.useState(false);
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
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
 
    degidratationRef.current = (call) => {
        const code = render(
            'chek',
            undefined,
            {...style, width: '100%', display:'block'},
            labelStyle,
            {},
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);
    

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='CheckBox'
            style={{...style, width: '100%', display:'block'}}
        >
            <CheckBoxInput
                value={state}
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    setState(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const SwitchInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
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
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    
    degidratationRef.current = (call) => {
        const code = render(
            'switch',
            undefined,
            {...style, width: '100%', display:'block'},
            labelStyle,
            {},
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='Switch'
            style={{...style, width: '100%', display:'block'}}
        >
            <SwitchInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const ToggleInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
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
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
   
    degidratationRef.current = (call) => {
        const code = render(
            'toogle',
            undefined,
            {...style, width: '100%', display:'block'},
            labelStyle,
            {},
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='ToggleButtons'
            style={{...style, width: '100%', display:'block'}}
        >
            <ToggleInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const SelectInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        styles,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
  
    degidratationRef.current = (call) => {
        const code = render(
            'select',
            undefined,
            {...style, width: '100%', display:'block'},
            labelStyle,
            styles,
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='Select'
            style={{...style, width: '100%', display:'block'}}
        >
            <SelectInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                styles={styles}
                {...otherProps}
            />
        </div>
    );
});

export const AutoCompleteInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        styles,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    
    degidratationRef.current = (call) => {
        const code = render(
            'autocomplete',
            undefined,
            {...style, width: '100%', display:'block'},
            labelStyle,
            styles,
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='AutoComplete'
            style={{...style, width: '100%', display:'block'}}
        >
            <AutoCompleteInput
                labelSx={labelStyle}
                styles={styles}
                placeholder='выбери из двух стульев'
                onChange={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const FileInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        styles,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    
    degidratationRef.current = (call) => {
        const code = render(
            'file',
            undefined,
            {...style, width: '100%', display:'block'},
            labelStyle,
            styles,
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);


    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='File'
            style={{...style, width: '100%', display:'block'}}
        >
            <FileInput
                labelSx={labelStyle}
                onUpload={(v)=> {
                    emiter('onChange', v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                styles={styles}
                {...otherProps}
            />
        </div>
    );
});