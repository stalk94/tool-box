import React from 'react';
import { Popover, Box, Button } from '@mui/material';
import { TextInput } from "src/index";

type UsePopUpNameResult = {
    popover: React.ReactElement;
    handleOpen: (e: React.MouseEvent<HTMLElement>) => void;
    handleClose: () => void;
    name: string;
    trigger: string | null;
}
type UsePopUpCustom = {
    popover: React.ReactElement;
    handleOpen: (e: React.MouseEvent<HTMLElement>) => void;
    handleClose: () => void;
    trigger: string | null;
}


export function useSafeAsyncEffect(
    callback: (isMounted: () => boolean) => void | Promise<void>,
    deps: React.DependencyList = []
) {
    React.useEffect(() => {
        let mounted = true;

        const run = async () => {
            try {
                await callback(() => mounted);
            } catch (e) {
                console.error('❌ useSafeAsync error:', e);
            }
        };

        run();

        return () => {
            mounted = false;
        };
    }, deps);
}


export const usePopUpName = (): UsePopUpNameResult => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [name, setName] = React.useState('');
    const [trigger, setTrigger] = React.useState<string | null>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
        setName('');
    }
    const handleSubmit = () => {
        if (!name.trim()) return;
        setTrigger(name.trim());
        handleClose();
    }


    const popover = (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                <TextInput
                    size="small"
                    placeholder="Название"
                    value={name}
                    onChange={setName}
                />
                <Button
                    variant="contained"
                    size="small"
                    disabled={!name.trim()}
                    onClick={handleSubmit}
                >
                    OK
                </Button>
            </Box>
        </Popover>
    );

    return {
        handleOpen,
        handleClose,
        popover,
        name,
        trigger, // значение, которое можно слушать в useEffect
    };
}

export const usePopUpCustom = (content): UsePopUpCustom => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [trigger, setTrigger] = React.useState<string | null>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }


    const popover = (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                { content }
            </Box>
        </Popover>
    );

    return {
        handleOpen,
        handleClose,
        popover,
        trigger, // значение, которое можно слушать в useEffect
    };
}