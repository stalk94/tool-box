import React from 'react';
import { Popover, useTheme, PopoverProps, PopoverOrigin } from '@mui/material';


export type HoverPopoverProps = {
    children: React.ReactElement
    content: React.ReactNode
    delay?: number
    styles?: {
        popover?: React.CSSProperties
        form?: React.CSSProperties
    }
    transformOrigin?: PopoverOrigin
    anchorOrigin?: PopoverOrigin

}


export default function HoverPopover({ children, content, delay = 50, styles, ...props }: HoverPopoverProps) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const timeoutRef = React.useRef<number | null>(null);

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setAnchorEl(event.currentTarget);
    }
    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(() => {
            setAnchorEl(null);
        }, delay);
    }
    React.useEffect(()=> {
        setAnchorEl(null);
    }, [children]);


    return (
        <>
            {React.cloneElement(children, {
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
            })}

            <Popover
                id="hover-popover"
                sx={{ 
                    pointerEvents: 'none', 
                    ...styles?.popover 
                }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            transform: 'translateX(-8px)', // точная подстройка
                            overflow: 'auto',
                        }
                    }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableRestoreFocus
            >
                <div 
                    onMouseEnter={() => timeoutRef.current && clearTimeout(timeoutRef.current)}
                    onMouseLeave={handleMouseLeave}
                    style={{ 
                        pointerEvents: 'auto', 
                        padding: 8,
                        background: 'rgb(60, 60, 59)',
                        width: '20vw',
                        height: 250,
                        ...styles?.form
                    }}
                >
                    { content }
                </div>
            </Popover>
        </>
    );
}