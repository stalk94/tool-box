import React from "react";
import { Button, TextField, Box, Dialog, Paper, Typography, Tooltip, IconButton, Menu as MenuPoup, ButtonGroup } from "@mui/material";
import { TouchApp, ViewComfy, Add, GridView } from "@mui/icons-material";
import { useEditor } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from "src/components/input/input.any";
import NumberInput from "src/components/input/number";


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
            <Box>
                { breackpoints.map((br, i)=> 
                    <button key={i}
                        style={{
                            cursor: 'pointer',
                            color: curBreacpoint === br ? '#c85b9c9e' : '#c9c5c5c7',
                            background: 'transparent',
                            padding: '5px',
                            marginRight: '8px',
                            borderRadius: '4px',
                            border: `1px solid ${curBreacpoint === br ? '#c85b9c9e' : '#c9c5c55f'}`, 
                        }}
                        onClick={()=> setCurBreacpoint(br)}
                    >
                        { br }
                    </button>
                )}
            </Box>
            <Box sx={{ml: 3}}>
                <IconButton
                    disabled={!curentPageName}
                    sx={{}}
                >
                    <Add />
                </IconButton>
            </Box>
            <Box sx={{ml: 'auto', display: 'flex'}}>
                <IconButton 
                    onClick={()=> {
                        globalThis.EDITOR = true;
                        setShowBlocEditor(true);
                    }}
                >
                    <GridView />
                </IconButton>
            </Box>
        </Paper>
    );
}