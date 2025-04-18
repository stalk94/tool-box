import React, { useState } from 'react';
import { Paper, IconButton, Box, Typography } from '@mui/material';
import { Close, DragIndicator, ExpandMore, ExpandLess } from '@mui/icons-material';
import { JsonViewer } from '@textea/json-viewer';
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";


export default function InspectorPanel ({ data, onClose }) {
    const [mod, setMod] = useState<'event'|'storage'>('event');
    const [collapsed, setCollapsed] = useState(false);
    const inspector = useHookstate(infoState.inspector);
    
    React.useEffect(()=> {
        sharedEmmiter.onAny((key, value)=> {
            inspector.task.set((prew)=> {
                prew.push({
                    component: key,
                    ...value,
                });
                return prew;
            });
        });
    }, []);


    return (
        <Paper
            sx={{
                zIndex: 1500,
                width: '100%',
                maxHeight: '40vh',
                background: '#1e1e1e',
                color: 'white',
                overflow: 'auto',
                resize: 'both',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    marginTop:'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1,
                    py: 0.5,
                    background: '#2d2d2d',
                    borderTop: '1px solid #5555559d',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    
                    <Typography variant="caption">
                        Инспектор
                    </Typography>
                </Box>
                <Box>
                    <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed
                            ? <ExpandLess sx={{ color: '#aaa', fontSize:14 }} />
                            : <ExpandMore sx={{ color: '#aaa', fontSize:14 }} />
                        }
                    </IconButton>
                    <IconButton size="small" onClick={onClose}>
                        <Close sx={{ color: '#aaa', fontSize:14 }} />
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
                    <JsonViewer
                        displayDataTypes={false} 
                        value={
                            mod==='event' 
                                ? [...inspector.task.get()].reverse() 
                                : inspector.lastData.get() 
                        }
                        defaultInspectDepth={3}
                        rootName={false}
                        theme="dark"
                        enableClipboard={true}
                    />
                </Box>
            )}
        </Paper>
    );
}