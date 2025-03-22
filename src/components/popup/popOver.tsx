import { Popover, Typography } from "@mui/material";
import React from "react";

const PopoverContext = React.createContext<{
    anchorEl: HTMLElement | null;
    content: string;
    setPopover: (anchorEl: HTMLElement | null, content: string) => void;
} | null>(null);


export const usePopover = () => {
    const context = React.useContext(PopoverContext);

    if (!context)  throw new Error("usePopover must be used within a PopoverProvider");
    
    return context;
}


//todo: стилизировать
export function PopoverProvider({ children }: { children: React.ReactNode }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [content, setContent] = React.useState<string>('');

    const setPopover =(anchorEl: HTMLElement | null, content: string)=> {
        setAnchorEl(anchorEl);
        setContent(content);
    }
    const handlePopoverClose =()=> {
        setAnchorEl(null);
    }


    return(
        <PopoverContext.Provider value={{ anchorEl, content, setPopover }}>
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>
                    { content }
                </Typography>
            </Popover>
            { children }
        </PopoverContext.Provider>
    );
}


export function PopoverWrapperElement({ children, content }: { children: React.ReactNode, content: string }) {
    const { setPopover } = usePopover();

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setPopover(event.currentTarget, content);
    }
    const handleMouseLeave = () => {
        setPopover(null, '');
    }

    return (
        <span
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-popover
        >
            { children }
        </span>
    );
}