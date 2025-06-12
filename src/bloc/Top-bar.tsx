import React from "react";
import { Button, TextField, Box, Dialog, Paper, Typography, Tooltip, IconButton, MenuItem, Select } from "@mui/material";
import { DynamicFeed, TouchApp, ViewComfy, Add, Input, Settings, Lock, LockOpen } from "@mui/icons-material";
import { editorContext, infoSlice, cellsSlice } from "./context";
import NumberInput from "src/components/input/number";



const categories = [
    { id: 'block', label: <TouchApp/> },
    { id: 'grid', label: <ViewComfy/> },
    { id: 'settings', label: <Settings/> },
    { id: 'preview', label: <Input style={{fontSize: 24}} /> }
];
const Instrument = () => {
    const lock = editorContext.lock.use();
    const mod = editorContext.mod.use();

    if(mod === 'block') return(
        <>
            <IconButton
                onClick={() => editorContext.lock.set((l)=> l = !l)}
            >
                { lock && <Lock sx={{fontSize:18, color: '#c65555'}} /> }
                { !lock && <LockOpen sx={{fontSize:18}} /> }
            </IconButton>
        </>
    );
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
    const ref = React.useRef<HTMLDivElement>(null);
    const [width, setWidth] = React.useState('100%');
    const [bound, setBound] = React.useState<DOMRect>();
    const selectCell = infoSlice.select.cell.use();
    const mod = editorContext.mod.use();
    const size = editorContext.size.use();


    const handleChangeBreackpoint = (bp: 'lg'|'md'|'sm'|'xs') => {
        const breakpoints = { lg: 1200, md: 960, sm: 600, xs: 460 };
        const width = breakpoints[bp] ?? 1200;
        editorContext.size.breackpoint.set(bp);
        editorContext.size.width.set(width);
    }
    React.useEffect(() => {
        if (!ref.current) return;

        const i = setInterval(()=> {
            const bound = ref.current.getBoundingClientRect();
            if(window.innerWidth - bound.x !== width) setWidth(window.innerWidth - bound.x);
        }, 400);

        return () => clearInterval(i);
    }, []);
    React.useEffect(()=> {
        if (selectCell && selectCell.getBoundingClientRect) {
            const bound = selectCell.getBoundingClientRect();
            setBound(bound);
        }
    }, [selectCell]);
    

    return (
        <Paper 
            component='div'
            ref={ref}
            elevation={2}
            sx={{
                height: '5%', 
                minHeight: 45,
                width: width, 
                background:'rgb(58, 58, 58)',
                border: '1px solid #cdcbcb36',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                px: 2,
                ml: 0.5,
                zIndex: 999,
                position: 'fixed',
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
                            color: mod === elem.id ? 'rgba(255, 255, 255, 0.8)' : 'gray',
                            background: 'transparent',
                            padding: '5px',
                            marginRight: '8px',
                            borderRadius: '4px',
                            border: `1px ${mod === elem.id ? 'solid rgba(255, 255, 255, 0.8)' : 'dotted #c9c5c55f'}`, 
                        }}
                        onClick={()=> editorContext.mod.set(elem.id)}
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
                        sx={{ fontSize: 14, height: 30, color: '#ccc', background: 'rgba(255, 255, 255, 0.05)'}}
                    >
                        { ['lg', 'md', 'sm', 'xs'].map((br) => (
                            <MenuItem key={br} value={br} >
                                { br }
                            </MenuItem>
                        ))}
                    </Select>
                    <span style={{marginRight:'10px', marginLeft:'7px',color:'gray'}}>⋮</span>
                    <NumberInput
                        value={size?.width}
                        min={0}
                        step={20}
                        max={window.innerWidth}
                        onChange={(v) => editorContext.size.width.set(v)}
                        sx={{ 
                            maxWidth: '80px',
                            height: 32,
                        }}
                    />
                    <Typography variant="subtitle1" sx={{ mx:1.5,color:'gray' }}>
                        ×
                    </Typography>
                    <NumberInput
                        value={size?.height}
                        onChange={(v) => editorContext.size.height.set(v)}
                        min={0}
                        max={10000}
                        step={20}
                        sx={{ 
                            mr: 3, 
                            width: '70px',
                            height: 32,
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



/**
 * <Box>
                <MenuPoup 
                    anchorEl={open} 
                    keepMounted 
                    PaperProps={{
                        style: {
                            width: '40%'
                        },
                    }}
                    open={Boolean(open)} 
                    onClose={()=> setOpen()}
                    sx={{mt: 1}}
                >
                    <Box sx={{p:2, display:'flex', justifyContent:'center'}}>
                        { select.content.get({ noproxy: true }) }
                    </Box>
                </MenuPoup>
                { currentContentData &&
                    <Button 
                        color='navigation'
                        onClick={(e)=> setOpen(e.currentTarget)} 
                        sx={{fontSize:'12px',textDecoration:'underline'}}
                    >
                        { currentContentData.type }
                    </Button>
                }
            </Box>
            <Box sx={{ml:'auto'}}>
                <SelectButton
                    variant="outlined"
                    color='inherit'
                    sx={{color: '#bababa69', background:'#0000001a',fontSize:12}}
                    value={{ id: 'home', label: 'Компоновшик', icon: <Extension /> }}
                    items={[
                        { id: 'home', label: 'Компоновшик', icon: <Extension /> },
                        { id: 'grid', label: 'Сетка' }
                    ]}
                    onChange={(v)=> context.mod.set(v.id)}
                />
            </Box>
 */