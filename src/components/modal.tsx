import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type ModalProps = {
    open: boolean
    setOpen: (open: boolean)=> void
    children: React.ReactNode
}


export default function SimpleDialog({ open, setOpen, children }: ModalProps) {
    const handleClose = () => {
        setOpen(false);
    }


    return (
        <Dialog
            open={open} 
            onClose={handleClose}
            sx={{
                "& .MuiPaper-root": {
                    background: (theme)=> theme.palette.menu.main,
                    backdropFilter: "blur(14px)",
                },
            }}
        >
            <DialogTitle>

                <IconButton
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    sx={{ 
                        position: 'absolute', 
                        right: 1, 
                        top: 2 
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                { children }
                { !children && <p>Это содержимое модального окна.</p> }
            </DialogContent>
        </Dialog>
    );
}