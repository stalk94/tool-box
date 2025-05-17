import React from "react";
import { Button, TextField, Box, Dialog, Paper, Typography, Tooltip, IconButton, MenuItem, Select } from "@mui/material";
import { Component, LayoutCustom } from '../type';
import { DynamicFeed, TouchApp, ViewComfy, Add, Input } from "@mui/icons-material";
import { GrStorage } from "react-icons/gr";
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "./context";
import { useHookstate } from "@hookstate/core";
import NumberInput from "src/components/input/number";



export type ContentData = {
    id: number 
    type: 'Button' | 'IconButton' | 'Typography'
}
const categories = [
    { id: 'block', label: <TouchApp/> },
    { id: 'grid', label: <ViewComfy/> }
];
const Instrument = () => {
    const mod = useHookstate(useEditorContext().mod);

    if(mod.get() === 'grid') return(
        <>
            <IconButton
                onClick={() => EVENT.emit('addCell', {})}
            >
                <Add />
            </IconButton>
        </>
    );
}


/**
 * --------------------------------------------------------------------------
 * список всех компонентов редактора
 * todo: что бы восстановить позицию элемента после редактора:  
 *      style={{transform: `translate(${comp.offset.x}px, ${comp.offset.y}px)`,}}
 * todo: дессериализатор функции:
 *      const deserializedFunction = eval('(' + serializedFunction + ')');
 * --------------------------------------------------------------------------
 */ 


// верхняя полоска (инфо обшее)
export const ToolBarInfo = ({ setShowBlocEditor }) => {
    const ctx = useHookstate(useEditorContext());
    const [bound, setBound] = React.useState<DOMRect>();
    const info = useHookstate(useInfoState());

    

    const handleChangeBreackpoint = (bp: 'lg'|'md'|'sm'|'xs') => {
        const breakpoints = { lg: 1200, md: 960, sm: 600, xs: 460 };
        const width = breakpoints[bp] ?? 1200;
        ctx.size.breackpoint.set(bp);
        ctx.size.width.set(width);
    }
    React.useEffect(()=> {
        const value = info.select.cell.get({noproxy:true});

        if(value) {
            const bound = value.getBoundingClientRect();
            setBound(bound);
        }
    }, [info.select.cell]);


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
                px: 2,
                ml: 0.5,
            }}
        >
            <Box sx={{ml:1}}>
                { setShowBlocEditor &&
                    <button
                        style={{
                            border: 'none',
                            cursor: 'pointer',
                            color: 'gray',
                            background: 'transparent',
                            padding: '5px',
                            marginRight: '80px',
                            borderRadius: '4px',
                        }}
                        onClick={() => {
                            globalThis.EDITOR = false;
                            setShowBlocEditor(false);
                        }}
                    >
                        <DynamicFeed sx={{ color: 'white', mt: 0.7 }} />
                    </button>
                }
                { categories.map((elem, i)=> 
                    <button key={i}
                        style={{
                            cursor: 'pointer',
                            color: ctx.mod.get() === elem.id ? 'rgba(255, 255, 255, 0.8)' : 'gray',
                            background: 'transparent',
                            padding: '5px',
                            marginRight: '8px',
                            borderRadius: '4px',
                            border: `1px ${ctx.mod.get() === elem.id ? 'solid rgba(255, 255, 255, 0.8)' : 'dotted #c9c5c55f'}`, 
                        }}
                        onClick={()=> ctx.mod.set(elem.id)}
                    >
                        { elem.label }
                    </button>
                )}
            </Box>
            
            <Box sx={{ml: 3}}>
                <Instrument />
            </Box>


            <Box sx={{ml: 'auto', display: 'flex'}}>
                <Box display="flex" alignItems="center">
                    <Select style={{marginLeft:'auto', marginRight:'5px'}}
                        size="small"
                        value={ctx?.size?.breackpoint?.get() ?? 'lg'}
                        onChange={(e) => handleChangeBreackpoint(e.target.value)}
                        displayEmpty
                        sx={{ fontSize: 14, height: 36, color: '#ccc', background: 'rgba(255, 255, 255, 0.05)'}}
                    >
                        { ['lg', 'md', 'sm', 'xs'].map((br) => (
                            <MenuItem key={br} value={br} >
                                { br }
                            </MenuItem>
                        ))}
                    </Select>
                    <span style={{marginRight:'10px', marginLeft:'7px',color:'gray'}}>⋮</span>
                    <NumberInput
                        value={ctx.size.width.get()}
                        min={0}
                        step={5}
                        max={window.innerWidth}
                        onChange={(v) => ctx.size.width.set(v)}
                        sx={{ 
                            maxWidth: '80px'
                        }}
                    />
                    <Typography variant="subtitle1" sx={{ mx:1.5,color:'gray' }}>
                        ×
                    </Typography>
                    <NumberInput
                        value={ctx.size.height.get()}
                        onChange={(v) => ctx.size.height.set(v)}
                        min={0}
                        max={10000}
                        step={5}
                        sx={{ 
                            width: '18%',
                            mr: 3, 
                            width: '70px'
                        }}
                    />
                </Box>
                <Tooltip title="ℹ размеры выбранной ячейки">
                    <Typography variant='caption' sx={{ textDecoration: 'underline' }}>
                        ⌗ {bound?.width??0} x {bound?.height??0}
                    </Typography>
                </Tooltip>
            </Box>
        </Paper>
    );
}