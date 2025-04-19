import React from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import context, { infoState, cellsContent } from '../../context';
import { useHookstate } from '@hookstate/core';


export type ToolbarOption = {
    icon: React.ReactNode;
    action: () => void;
    tooltip?: string;
}
export type ContextualToolbarProps = {
    options: ToolbarOption[];
    align?: 'top' | 'bottom';
    offsetY?: number;
    visible?: boolean;
    position?: 'center' | 'left' | 'right';
}
export function useToolbar(id: number, onVisibleChange?: (v: boolean)=> void, alwaysVisible = false) {
    const selected = useHookstate(infoState.select.content);
    const [visible, setVisible] = React.useState(false);


    React.useEffect(() => {
        const isSelected = selected.get({noproxy:true})?.props?.['data-id'] === id;
        const show = alwaysVisible || isSelected;
        setVisible(show);
        onVisibleChange?.(show);
    }, [selected, id, alwaysVisible]);


    return { visible, selected, context, cellsContent };
}


const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
    options,
    align = 'top',
    offsetY = -30,
    visible = true,
    position = 'right',
    width = '200px'
}) => {
    if (!visible) return null;

    let justifyContent: 'flex-start' | 'center' | 'flex-end' = 'center';
    if (position === 'left') justifyContent = 'flex-start';
    if (position === 'right') justifyContent = 'flex-end';


    return (
        <Box
            sx={{
                position: 'absolute',
                [align]: offsetY,
                [position]: 0, 
                top: 0,
                display: 'flex',
                justifyContent,
                width,
                gap: 0.5, 
                flexDirection: 'row',  
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `
                    0px 2px 4px 0px rgba(0, 0, 0, 0.3),
                    0px 1px 5px 0px rgba(0, 0, 0, 0.2)`,
                zIndex: 100,
                pointerEvents: 'auto',
            }}
            style={{padding: '6px'}}
        >
            { options.map((opt, i) => (
                <IconButton
                    key={i}
                    size="small"
                    onClick={opt.action}
                    sx={{ color: '#ccc', fontSize: 14, height: 24, width:24 }}
                >
                    { opt.icon }
                </IconButton>
            ))}
        </Box>
    );
}


export default ContextualToolbar;