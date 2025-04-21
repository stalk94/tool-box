import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Dialog, Paper, Typography, Tooltip, IconButton, Menu as MenuPoup, ButtonGroup } from "@mui/material";
import { Component, LayoutCustom } from './type';
import { Settings, Menu, Logout, VerifiedUser, Extension, TouchApp, ViewComfy, Add } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from "src/components/input/input.any";
import NumberInput from "src/components/input/number";



export type ContentData = {
    id: number 
    type: 'Button' | 'IconButton' | 'Typography'
}
const categories = [
    { id: 'block', label: <TouchApp/> },
    { id: 'grid', label: <ViewComfy/> },
];

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
export const ToolBarInfo = () => {
    const ctx = useHookstate(context);
    const [open, setOpen] = React.useState<undefined>();
    const [currentContentData, setCurrent] = React.useState<ContentData>();
    const [bound, setBound] = React.useState<DOMRect>();
    const select = useHookstate(infoState.select);
    const container = useHookstate(infoState.container);


    React.useEffect(()=> {
        const value = select.cell.get({noproxy:true});

        if(value) {
            const bound = value.getBoundingClientRect();
            setBound(bound);
        }
    }, [select.cell]);
    React.useEffect(()=> {
        const content = select.content.get({ noproxy: true });

        if(content) {
            if(content.props['data-id']) setCurrent({
                id: content.props['data-id'],
                type: content.props['data-type']
            });
            else console.warn('🚨 У контента отсутствует data-id');
        }
    }, [select.content]);


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
                {categories.map((elem, i)=> 
                    <button key={i}
                        style={{
                            cursor: 'pointer',
                            color: ctx.mod.get() === elem.id ? '#c85b9c9e' : '#c9c5c5c7',
                            background: 'transparent',
                            padding: '5px',
                            marginRight: '8px',
                            borderRadius: '4px',
                            border: `1px solid ${ctx.mod.get() === elem.id ? '#c85b9c9e' : '#c9c5c55f'}`, 
                        }}
                        onClick={()=> ctx.mod.set(elem.id)}
                    >
                        { elem.label }
                    </button>
                )}
            </Box>
            <Box sx={{ml: 3}}>
                <IconButton
                    disabled={!(ctx.mod.get()==='grid')}
                    sx={{}}
                    onClick={()=> EVENT.emit('addCell', {})}
                >
                    <Add />
                </IconButton>
            </Box>
            <Box sx={{ml: 'auto', display: 'flex'}}>
                <Box display="flex" alignItems="center">
                    <NumberInput
                        value={container.width.get()}
                        min={0}
                        max={window.innerWidth}
                        onChange={(v) => ctx.size.width.set(v)}
                        sx={{ 
                            maxWidth: '80px',
                        }}
                    />
                    <Typography variant="subtitle1" sx={{ mx:1.5 }}>×</Typography>
                    <NumberInput
                        value={container.height.get()}
                        onChange={(v) => ctx.size.height.set(v)}
                        min={0}
                        max={10000}
                        sx={{ 
                            width: '18%',
                            mr: 3, 
                            width: '70px',
                        }}
                    />
                </Box>
                { bound && 
                    <Tooltip title="ℹ размеры выбранной ячейки">
                        <Typography variant='caption' sx={{textDecoration:'underline'}}>
                            ⌗ { bound.width } x { bound.height }
                        </Typography>
                    </Tooltip>
                }
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