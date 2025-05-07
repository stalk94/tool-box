import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Typography, Select, MenuItem, Popper, IconButton } from '@mui/material';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Range } from 'slate';
import { NumberInput, SelectInput } from '../../../index';


const fabrickPropsPopper = (type, value, onChange) => {
    if (type === 'fontFamily') {
        return <Select style={{ marginLeft: 'auto', marginRight: '5px' }}
            size="small"
            value={value}
            onChange={(e) => onChange(type, e.target.value)}
            displayEmpty
            sx={{ fontSize: 10, height: 30, color: '#ccc', background: '#2a2a2a' }}
        >
            <MenuItem value="" disabled>𝓣</MenuItem>
            {globalThis.FONT_OPTIONS.map((font) => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                </MenuItem>
            ))}
        </Select>
    }
}

export const TypographySlot = React.forwardRef((props: any, ref) => {
    const { style, onChangeProps, ...otherProps } = props;
    const [select, setSelect] = useState(false);
    const innerRef = useRef<HTMLDivElement>(null);
   

    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const newText = e.currentTarget.innerText;
        if (onChangeProps) onChangeProps({ ...otherProps, children: newText });
        setSelect(false);
    }
    const toggleProp = (key: string, value: any) => {
        const next = otherProps[key] === value ? undefined : value;
        onChangeProps?.({ ...otherProps, [key]: next });
    }

    useEffect(() => {
        if (select && innerRef.current) {
            innerRef.current.focus();
        }
    }, [select]);


    return (
        <>
            <Typography
                ref={innerRef}
                data-type="TypographySlot"
                contentEditable={globalThis.EDITOR && select}
                suppressContentEditableWarning
                onClick={() => setSelect(true)}
                onBlur={handleBlur}
                style={style}
                {...otherProps}
                sx={{
                    width: '100%',
                    display: 'block',
                    cursor: 'text',
                    ...otherProps.sx,
                }}
            >
                {otherProps.children}
            </Typography>
        </>
    );
})



/**
 * <IconButton
                        size="small"
                        onClick={() => toggleProp('fontWeight', 'bold')}
                    >
                    </IconButton>
                    {fabrickPropsPopper?.('fontFamily', otherProps.fontFamily, toggleProp)}
 */