import React from 'react';
import { JSONContent } from '@tiptap/react';
import { Typography, TypographyProps } from '@mui/material';
import { useHookstate } from '@hookstate/core';
import { updateComponentProps } from '../utils/updateComponentProps';
import { useInfoState, useEditorContext } from "../context";
import { useDebounced } from 'src/components/hooks/debounce';
import TipTapSlotEditor from './tip-tap';
import { exportText, exportTypography, formatJsx } from './export/Text';


type TextWrapperProps = {
    'data-id': number
    'data-type': 'Text'
    fullWidth: boolean
    children: JSONContent
    style: React.CSSProperties
}
type TypographyWrapperProps = TypographyProps & {
    'data-id': number
    'data-type': 'Typography'
    fullWidth: boolean
    children: string
    styles?: {
        text: React.CSSProperties
    }
}



export const TextWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { children, 'data-id': dataId, style, fullWidth, ...otherProps } = props;
   
    const onChange = useDebounced((data) => {
        updateComponentProps({
            component: { props: props },
            data: { children: data }
        });
    }, 1000);
    degidratationRef.current = (call) => {
        const code = exportText(
            children,
            { width: '100%', ...style },
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


    return(
        <div 
            data-id={dataId} 
            data-type="Text" 
            style={{ width: '100%', ...style }}
        >
            <TipTapSlotEditor
                value={children}
                onChange={(html) => onChange(html)}
                placeholder="Текст"
                className="no-p-margin"
                isEditable={EDITOR}
                initialInsert={{
                    text: 'Title',
                    fontSize: '1rem',
                    fontFamily: 'Roboto Condensed", Arial, sans-serif',
                    fontWeight: '500',
                }}
            />
        </div>
    );
});
export const TypographyWrapper = React.forwardRef((props: TypographyWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { children, 'data-id': dataId, styles, style, fullWidth, ...otherProps } = props;
    const [text, setText] = React.useState(children);
    const infoState = useInfoState();
    const selected = useHookstate(infoState.select.content);
    
    const handleBlur = (e) => {
        const newText = e.target.innerText;
        setText(newText);
        updateComponentProps({
            component: { props: props },
            data: { children: newText }
        });
    }
    degidratationRef.current = (call) => {
        const code = exportTypography(
            text ?? children,
            { width: '100%', display:'block', ...styles?.text, fontSize: styles?.text?.fontSize + 'px' },
            style,
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
    React.useEffect(() => {
        if(children) setText(children);
    }, [children]);
    

    return(
        <Typography
            ref={ref} 
            data-id={dataId}
            data-type="Typography" 
            contentEditable={globalThis.EDITOR && selected.get({noproxy:true})?.props?.['data-id'] === dataId}
            suppressContentEditableWarning
            onBlur={handleBlur}
            { ...otherProps }
            style={style}
            sx={{ width: '100%', display:'block', ...styles?.text, fontSize: styles?.text?.fontSize + 'px' }}
        >
            { text ?? children }
        </Typography>
    );
});