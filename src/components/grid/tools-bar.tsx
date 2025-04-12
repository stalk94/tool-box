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
export const Toolbar =({ useUndo, useAdd, useClick, current, tools })=> {

    return (
        <Item sx={{ px: 2, backgroundColor: '#32313bab', maxHeight:'50px' }}>
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

            { tools }
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
                background: '#00000084',
                left: 0,
                bottom: 0,
                width: '50%',
                maxHeight: '25%',
                zIndex: 3,
                overflowY: "auto",
                visibility: visibility ? 'visible' : 'hidden'
            }}
        >
            <Stack>
                { items.map((elem, index)=> 
                    <div 
                        style={{
                            borderBottom: '1px dotted #726e6e66',
                            marginTop: '3px',
                            maxWidth: '100%',
                        }}
                        key={index} 
                        onClick={(e)=> handlerClick(elem, index)}
                    >
                        { elem.label }
                    </div>
                )}
            </Stack>
        </Box>
    );
}