import React from 'react';
import Paper from '@mui/material/Paper';
import styled from 'styled-components';
import { Delete, AddBox, ArrowBack, Layers, TableRows, ViewWeek } from '@mui/icons-material';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button, ButtonGroup, Stack } from '@mui/material';
import { variants } from '../button';



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
export const Toolbar =({ useUndo, useAdd, disabled })=> {
    return (
        <Item sx={{ px: 2, backgroundColor: '#32313bab' }}>
            <Button 
                color='error'
                variant='outlined'
                onClick={useUndo}
                disabled={disabled}
                sx={{ mr: 'auto' }}
            >
                <ArrowBack />
            </Button>

            <Stack direction="row" spacing={1}>
                <Button
                    startIcon={
                        <AddBox style={{position: 'absolute',fontSize:'1rem',color:'#c1f755'}} />
                    }
                    disabled={disabled}
                    variant='outlined'
                    onClick={() => useAdd('vertical')}
                    sx={{ mx: 'auto' }}
                >
                    <TableRows />
                </Button>
                <Button
                    startIcon={
                        <AddBox style={{position: 'absolute',fontSize:'1rem',color:'#c1f755'}} />
                    }
                    disabled={disabled}
                    variant='outlined'
                    onClick={() => useAdd('horizontal')}
                    sx={{ mx: 'auto' }}
                >
                    <ViewWeek />
                </Button>
            </Stack>
        </Item>
    );
}
export const ToolbarCell =({ useAdd, disabled })=> {
    return(
        <Item sx={{ px: 2, ml: 3, backgroundColor: '#4543528a' }}>
             <Button 
                disabled={disabled}
                onClick={()=> {
                    useAdd('row');
                }}
                sx={{my: 1, ml: 1}} 
            >
                save
            </Button>
            <Button 
                disabled={disabled}
                onClick={()=> {
                    useAdd('column');
                }}
                sx={{my: 1, ml: 1}} 
            >
                import
            </Button>
        </Item>
    );
}
const GridDesktop =()=> {
    const style = {display: 'flex', alignItems: 'center', justifyContent: 'center',border:'1px dotted gray'};
    
    return(
        <Splitter style={{ height: '100%' }}>

            <SplitterPanel
                style={{ ...style }}
                size={20}
                minSize={10}
            >
                PANEL 1
            </SplitterPanel>

            <SplitterPanel size={80}>
                <Splitter layout="vertical">
                    <SplitterPanel
                        style={{ ...style }}
                        size={15}
                    >
                        Panel 2
                    </SplitterPanel>

                    <SplitterPanel
                        style={{ ...style }}
                        size={85}
                    >
                        Panel 3
                    </SplitterPanel>

                    <SplitterPanel
                        style={{ ...style }}
                        size={20}
                    >
                        Panel 4
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>

        </Splitter>
    );
}
const GridCell =()=> {
    const style = {display: 'flex', alignItems: 'center', justifyContent: 'center',border:'1px dotted gray'};
    
    return(
        <Splitter style={{ height: '100%' }} onResizeEnd={(e) => console.log(e)}>

            <SplitterPanel>
                <Splitter layout="vertical" onResizeEnd={(e) => console.log(e)}>
                    <SplitterPanel
                        style={{ ...style }}
                        size={100}
                    >
                        Panel 1L
                    </SplitterPanel>

                    <SplitterPanel
                        style={{ ...style }}
                        size={100}
                    >
                        Panel 2L
                    </SplitterPanel>

                    <SplitterPanel
                        style={{ ...style }}
                        size={100}
                    >
                        Panel 3L
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>

            <SplitterPanel>
                <Splitter layout="horizontal" onResizeEnd={(e) => console.log(e)}>
                    <SplitterPanel
                        style={{ ...style }}
                        size={100}
                    >
                        Panel 1R
                    </SplitterPanel>

                    <SplitterPanel
                        style={{ ...style }}
                        size={100}
                    >
                        Panel 2R
                    </SplitterPanel>

                    <SplitterPanel
                        style={{ ...style }}
                        size={100}
                    >
                        Panel 3R
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>

        </Splitter>
    );
}


const GridEditor = ({ }) => {


    return(
        <div style={{
            height:'100%',
            width:'100%',
            display:'flex',
            flexDirection:'column'
        }}
        >
            <div style={{
                    width:'100%',
                    display:'flex',
                    flexDirection:'row',
                    marginBottom: '5px'
                }}
            >
                <Toolbar 
                    useAdd={console.log} 
                    useUndo={console.log} 
                    canUndo={false} 
                />
                <ToolbarCell useEditCell={console.log} />
            </div>

           <GridCell />
        </div>
    );
}