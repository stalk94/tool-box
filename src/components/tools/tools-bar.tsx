import React from 'react';
import Paper from '@mui/material/Paper';
import styled from 'styled-components';
import { Delete, AddBox, ArrowBack, Layers, TableRows, ViewWeek } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Stack } from '@mui/material';




const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#6666665f',
    textAlign: 'center',
    color: 'silver',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));
export const Toolbar =({ useUndo, useAdd, useClick, current })=> {
    return (
        <Item sx={{ px: 2, backgroundColor: '#32313bab' }}>
            <Button
                startIcon={
                    <AddBox style={{ position: 'absolute', fontSize: '1rem', color: '#c1f755' }} />
                }
                variant='outlined'
                onClick={() => useAdd('vertical')}
                sx={{ mr: 2 }}
            >
                <TableRows />
            </Button>
            <Button 
                color='error'
                variant='outlined'
                onClick={useUndo}
                disabled={!current}
                sx={{ mr: 'auto' }}
            >
                <Delete />
            </Button>

            <Stack direction="row" spacing={1}>
                <Button 
                    //disabled={disabled}
                    onClick={()=> {
                        useClick('save');
                    }}
                    sx={{my: 1, ml: 1}} 
                >
                    save
                </Button>
                <Button 
                    //disabled={disabled}
                    onClick={()=> {
                        useClick('import');
                    }}
                    sx={{my: 1, ml: 1}} 
                >
                    import
                </Button>
            </Stack>
        </Item>
    );
}



export const Components =({ visibility, onChange, items })=> {
    const handlerClick =(element, index)=> {
        onChange(element, index);
    }


    return(
        <Box
            sx={{
                margin: '1%',
                position: 'fixed',
                background: '#0000004d',
                left: 0,
                bottom: 0,
                width: '50%',
                maxHeight: '27%',
                zIndex: 3,
                overflowY: "auto",
                visibility: visibility ? 'visible' : 'hidden'
            }}
        >
            <Stack>
                { items.map((elem, index)=> 
                    <div key={index} onClick={(e)=> handlerClick(elem, index)}>
                        { elem }
                    </div>
                )}
            </Stack>
        </Box>
    );
}