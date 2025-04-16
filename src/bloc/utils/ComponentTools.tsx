import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, Functions } from '@mui/icons-material';
import { infoState } from '../context'; // путь может отличаться
import { useHookstate } from '@hookstate/core';

type Props = {
    id: number | string;
    children: React.ReactNode;
};

export const EditorWrapper = ({ id, children }: Props) => {
    const selected = useHookstate(infoState.select.content);
    const isSelected = selected?.get()?.props?.['data-id'] === id;

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                display: 'block',
            }}
            data-wrapper
        >
            {/* Панелька над компонентом */}
            {isSelected && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -28,
                        right: 0,
                        display: 'flex',
                        gap: 0.5,
                        zIndex: 20,
                        background: '#2c2c2c',
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.2,
                        boxShadow: 1,
                        pointerEvents: 'auto',
                    }}
                >
                    <Tooltip title="Редактировать">
                        <IconButton size="small" sx={{ color: '#ccc' }} onClick={() => console.log('Edit', id)}>
                            <Edit fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <IconButton size="small" sx={{ color: '#f55' }} onClick={() => console.log('Delete', id)}>
                            <Delete fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Функция">
                        <IconButton size="small" sx={{ color: '#0ff' }} onClick={() => console.log('Функция', id)}>
                            <Functions fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Контент компонента */}
            <Box sx={{ pointerEvents: 'auto' }}>
                {children}
            </Box>
        </Box>
    );
}