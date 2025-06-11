import React from "react";
import { Button, TextField, Box, Dialog, Paper, Typography, Tooltip, IconButton, MenuItem, Select } from "@mui/material";
import { DynamicFeed, TouchApp, ViewComfy, Add, Input } from "@mui/icons-material";
import { editorSlice, infoSlice, renderSlice, cellsSlice, guidesSlice } from "./context";
import NumberInput from "src/components/input/number";



export type ContentData = {
    id: number 
    type: 'Button' | 'IconButton' | 'Typography'
}
type Category = {
    id: 'block' | 'grid'
    label: React.JSX.Element
}
const categories: Category[] = [
    { id: 'block', label: <TouchApp/> },
    { id: 'grid', label: <ViewComfy/> }
];
const Instrument = () => {
    const mod = editorSlice.mod.use();

    if(mod === 'grid') return(
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
    const [bound, setBound] = React.useState<DOMRect>();
    const selectCell = infoSlice.select.cell.use();
    const mod = editorSlice.mod.use();
    const size = editorSlice.size.use();

    
    const handleChangeBreackpoint = (bp: 'lg'|'md'|'sm'|'xs') => {
        const breakpoints = { lg: 1200, md: 960, sm: 600, xs: 460 };
        const width = breakpoints[bp] ?? 1200;
        editorSlice.size.breackpoint.set(bp);
        editorSlice.size.width.set(width);
    }
    const handleClickToBaseContext =()=> {
        setShowBlocEditor({
            content: cellsSlice.get(),
            layout: renderSlice.get(),
            guides: guidesSlice.get(),
            size: {
                width: editorSlice.size.width.get(),
                height: editorSlice.size.height.get()
            }
        });
    }
    React.useEffect(() => {
        if (selectCell && selectCell.getBoundingClientRect) {
            const bound = selectCell.getBoundingClientRect();
            setBound(bound);
        }
    }, [selectCell]);


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
                        onClick={()=> {
                            EVENT.emit('leftBarChange', {
                                currentToolPanel: 'component'
                            });

                            setTimeout(handleClickToBaseContext, 50);
                        }}
                    >
                        <DynamicFeed sx={{ color: 'white', mt: 0.7 }} />
                    </button>
                }
                { categories.map((elem: typeof categories[number], i)=> 
                    <button key={i}
                        style={{
                            cursor: 'pointer',
                            color: mod === elem.id ? 'rgba(255, 255, 255, 0.8)' : 'gray',
                            background: 'transparent',
                            padding: '5px',
                            marginRight: '8px',
                            borderRadius: '4px',
                            border: `1px ${mod === elem.id ? 'solid rgba(255, 255, 255, 0.8)' : 'dotted #c9c5c55f'}`, 
                        }}
                        onClick={()=> editorSlice.mod.set(elem.id)}
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
                        value={size?.breackpoint ?? 'lg'}
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
                    <Typography variant="subtitle1" sx={{ mx:1.5,color:'gray' }}>
                        { size.width }
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mx:1.5,color:'gray' }}>
                        ×
                    </Typography>
                    <NumberInput
                        value={size.height}
                        onChange={(v) => editorSlice.size.height.set(v)}
                        min={0}
                        max={10000}
                        step={5}
                        sx={{ 
                            width: '18%',
                            mr: 3,
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