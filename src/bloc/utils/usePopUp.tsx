import React from 'react';
import { Popover, Box, Button } from '@mui/material';
import { TextInput } from "src/index";


export const usePopUpName = (onConfirm: (name: string) => void) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [name, setName] = React.useState('');
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
        onConfirm(name.trim());
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
    };
};