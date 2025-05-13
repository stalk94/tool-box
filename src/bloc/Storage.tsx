import React, { useState, useRef } from 'react';
import { Paper, IconButton, Box, Typography } from '@mui/material';
import { Close, DragIndicator, ExpandMore, ExpandLess } from '@mui/icons-material';
import { Form } from '../index';
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "./context";
import { useHookstate } from "@hookstate/core";
import StorageTable from './modules/sources/storage';
import { db } from "./utils/export";


export function PropsEditor () {
    const selectSlot = useHookstate(useInfoState().select.slot);
    const mod = useHookstate(useEditorContext().mod);
    const [collapsed, setCollapsed] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth-(window.innerWidth*0.75), y: window.innerHeight-(window.innerHeight*0.3) });
    const draggingRef = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });
   

    const onMouseDown = (e: React.MouseEvent) => {
        draggingRef.current = true;
        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    }
    const onMouseMove = (e: MouseEvent) => {
        if (draggingRef.current) {
            setPosition({
                x: e.clientX - offsetRef.current.x,
                y: e.clientY - offsetRef.current.y,
            });
        }
    }
    const onMouseUp = () => {
        draggingRef.current = false;
    }
    const render = () => {
        const slot = selectSlot.get({noproxy: true});
        const propsList = slot?.source?.propsList;
        const result = [];

        if(propsList) {
            Object.keys(propsList).forEach((key, index)=> {
                if(typeof propsList[key] === 'string') {
                    if(propsList[key] === 'number') {

                    }
                }
            })
        }
    }

    React.useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);
    React.useEffect(() => {
        const curSlot = selectSlot.get();
        if(curSlot) mod.set('slot');
    }, [selectSlot]);


    return(
         <Paper
            elevation={4}
            sx={{
                zIndex: 1500,
                width: window.innerWidth * 0.6,
                maxHeight: '30vh',
                background: '#1e1e1e',
                color: 'white',
                overflow: 'auto',
                resize: 'both',
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                top: position.y,
                left: position.x,
            }}
        >
            <Box
                onMouseDown={onMouseDown}
                sx={{
                    
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1,
                    py: 0.5,
                    background: '#2d2d2d',
                    borderTop: '1px solid #5555559d',
                    userSelect: 'none',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    
                </Box>
                <Box>
                    <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed
                            ? <ExpandLess sx={{ color: '#aaa', fontSize:14 }} />
                            : <ExpandMore sx={{ color: '#aaa', fontSize:14 }} />
                        }
                    </IconButton>
                </Box>
            </Box>

            {!collapsed && (
                <Box
                    sx={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        lineHeight: 1.4,
                        textAlign: 'left',           // ⬅️ ключевой момент
                        '& *': {
                            textAlign: 'left !important', // на случай переопределений
                        }
                    }}
                >
                    
                </Box>
            )}
        </Paper>
    );
}


export default function () {
    const [collapsed, setCollapsed] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth-(window.innerWidth*0.75), y: 60 });
    const draggingRef = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });
   
   

    const onMouseDown = (e: React.MouseEvent) => {
        draggingRef.current = true;
        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    }
    const onMouseMove = (e: MouseEvent) => {
        if (draggingRef.current) {
            setPosition({
                x: e.clientX - offsetRef.current.x,
                y: e.clientY - offsetRef.current.y,
            });
        }
    }
    const onMouseUp = () => {
        draggingRef.current = false;
    }

    React.useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);


    return(
         <Paper
            elevation={4}
            sx={{
                zIndex: 1500,
                width: window.innerWidth * 0.4,
                maxHeight: '60vh',
                background: '#1e1e1e',
                color: 'white',
                overflow: 'auto',
                resize: 'both',
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                top: position.y,
                left: position.x,
            }}
        >
            <Box
                onMouseDown={onMouseDown}
                sx={{
                    
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1,
                    py: 0.5,
                    background: '#2d2d2d',
                    borderTop: '1px solid #5555559d',
                    userSelect: 'none',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    
                </Box>
                <Box>
                    <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed
                            ? <ExpandLess sx={{ color: '#aaa', fontSize:14 }} />
                            : <ExpandMore sx={{ color: '#aaa', fontSize:14 }} />
                        }
                    </IconButton>
                </Box>
            </Box>

            {!collapsed && (
                <Box
                    sx={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        lineHeight: 1.4,
                        textAlign: 'left',           // ⬅️ ключевой момент
                        '& *': {
                            textAlign: 'left !important', // на случай переопределений
                        }
                    }}
                >
                    <StorageTable
                        height={400}
                        refreshInterval={5000}
                        dbKey='BASE'
                    />
                </Box>
            )}
        </Paper>
    );
}