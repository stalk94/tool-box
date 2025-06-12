import React from 'react';
import { JSONContent } from '@tiptap/react';
import { Typography, TypographyProps } from '@mui/material';
import { updateComponentProps } from '../helpers/updateComponentProps';
import { infoSlice, editorContext } from "../context";
import { useDebounced } from 'src/components/hooks/debounce';
import TipTapSlotEditor from './tip-tap';
import { exportText, exportTypography } from './export/text';



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
    fontFamily: string
}



export const TextWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { children, 'data-id': dataId, style, fullWidth, ...otherProps } = props;
   
    const onChange = useDebounced((data) => {
        updateComponentProps({
            component: { props: props },
            data: { children: data }
        });
    }, 1000);
    const exportCode = (call) => {
        const code = exportText(
            children,
            { width: '100%', ...style },
        );

        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);

    return(
        <div 
            ref={ref}
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
                    text: 'text',
                    fontSize: '1rem',
                    fontFamily: 'Roboto Condensed", Arial, sans-serif',
                    fontWeight: '500',
                }}
            />
        </div>
    );
});
export const TypographyWrapper = React.forwardRef((props: TypographyWrapperProps, ref) => {
    const lock = editorContext.lock.use();
    const { children, 'data-id': dataId, style, fullWidth, fontFamily, textAlign, ...otherProps } = props;
    const [text, setText] = React.useState(children);
    const selected = infoSlice.select.content.use();
    
    const handleBlur = (e) => {
        const newText = e.target.innerText;
        setText(newText);
        updateComponentProps({
            component: { props: props },
            data: { children: newText }
        });
    }
    const exportCode = (call) => {
        const code = exportTypography(
            text ?? children,
            { width: '100%', display: 'block' },
            {
                ...style,
                fontFamily,
                textAlign
            },
            otherProps
        );

        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);
    React.useEffect(() => {
        if(!EDITOR) return;

        if(children) setText(children);
    }, [children]);
    
    
    return(
        <Typography
            ref={ref} 
            data-id={dataId}
            data-type="Typography" 
            contentEditable={lock && globalThis.EDITOR && selected?.props?.['data-id'] === dataId}
            suppressContentEditableWarning
            onBlur={handleBlur}
            { ...otherProps }
            sx={{ 
                width: '100%', 
                whiteSpace: 'normal',     // перенос строк разрешён
                wordBreak: 'keep-all',    // слова не разбиваются
                overflowWrap: 'normal',
                display: 'block'
            }}
            style={{
                ...style,
                fontFamily,
                textAlign
            }}
        >
            { text ?? children }
        </Typography>
    );
});