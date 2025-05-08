import React from 'react';
import { Typography, Select, MenuItem, Divider } from '@mui/material';
import { useHookstate } from '@hookstate/core';
import { updateComponentProps } from '../utils/updateComponentProps';
import { useInfoState, useEditorContext } from "../context";
import { useDebounced } from 'src/components/hooks/debounce';
import { withResetOnRightClick } from './utils/hooks';
import TipTapSlotEditor from './tip-tap';


export const TextWrapper = React.forwardRef((props: any, ref) => {
    const { children, ['data-id']: dataId, ...otherProps } = props;

    const onChange = useDebounced((data) => {
        updateComponentProps({
            component: { props: props },
            data: { children: data }
        });
    }, 1000);
    

    return(
        <div 
            data-id={dataId} 
            data-type="Text" 
            style={{ width: '100%', ...props?.style }}
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


export const TypographyWrapper = React.forwardRef((props: any, ref) => {
    const { children, ['data-id']: dataId, styles, style, fullWidth, ...otherProps } = props;
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