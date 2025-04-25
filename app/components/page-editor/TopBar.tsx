import React from "react";
import { Button, TextField, Box, Dialog, Paper, Typography, Tooltip, IconButton, Menu as MenuPoup, ButtonGroup } from "@mui/material";
import { TouchApp, ViewComfy, Add, GridView } from "@mui/icons-material";
import { useEditor } from './context';


const breackpoints: ['lg', 'md', 'sm', 'xs'] = ['lg', 'md', 'sm', 'xs'];


export default function ({ setShowBlocEditor }) {
    const { curBreacpoint, setCurBreacpoint, curentPageName } = useEditor();

    React.useEffect(()=> {

    }, []);

   
    return (
        <Paper elevation={2}
            sx={{
                height:'5%', 
                minHeight: 44,
                width:'99%', 
                background:'rgb(58, 58, 58)',
                border: '1px solid #cdcbcb36',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                px: 3,
                ml: 0.5,
            }}
        >
            
            <Box sx={{ml: 0, mr: '80px', display: 'flex'}}>
                <IconButton 
                    onClick={()=> {
                        globalThis.EDITOR = true;
                        setShowBlocEditor(true);
                    }}
                >
                    <GridView />
                </IconButton>
            </Box>

            <Box sx={{ml: 4}}>
                { breackpoints.map((br, i)=> 
                    <button key={i}
                        style={{
                            cursor: 'pointer',
                            color: curBreacpoint === br ? 'white' : '#c9c5c55f',
                            background: 'transparent',
                            padding: '5px',
                            marginRight: '8px',
                            borderRadius: '4px',
                            border: `1px solid ${curBreacpoint === br ? 'white' : '#c9c5c55f'}`, 
                        }}
                        onClick={()=> setCurBreacpoint(br)}
                    >
                        { br }
                    </button>
                )}
            </Box>
        </Paper>
    );
}
