import React from "react";
import { Button, useTheme, Box, Paper, Typography, Tooltip } from "@mui/material";
import { GridEditorProps, LayoutCustom } from './type';
import { Settings, Menu, Logout, VerifiedUser, Extension, Save } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";




/**
 * --------------------------------------------------------------------------
 * список всех компонентов редактора
 * todo: что бы восстановить позицию элемента после редактора:  
 *      style={{transform: `translate(${comp.offset.x}px, ${comp.offset.y}px)`,}}
 * todo: дессериализатор функции:
 *      const deserializedFunction = eval('(' + serializedFunction + ')');
 * --------------------------------------------------------------------------
 */ 
export const listAllComponents = {
    Button: Button,
}


// верхняя полоска (инфо обшее)
export const ToolBarInfo = ({ render, setRender }) => {
    const [bound, setBound] = React.useState<DOMRect>();
    const select = useHookstate(infoState.select);
    const container = useHookstate(infoState.container);
    const curCell = useHookstate(context.currentCell); 
    const cellsCache = useHookstate(cellsContent);              // снимок данных ячеек

    React.useEffect(()=> {
        const value = select.cell.get({noproxy:true});

        if(value) {
            const bound = value.getBoundingClientRect();
            //console.log(value.children)
            setBound(bound);
            //console.log(curCell.get())
        }
    }, [select.cell]);


    return (
        <Paper elevation={2}
            sx={{
                height:'5%', 
                width:'99%', 
                background:'rgb(58, 58, 58)',
                border: '1px solid #cdcbcb36',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                px: 3,
                ml: 0.5
            }}
        >
            <Box
                sx={{ml: 'auto', display: 'flex',}}
            >
                <Tooltip title="ℹ размеры базового контейнера">
                    <Typography sx={{mr:1, color:'gold'}} variant='subtitle1'>
                        { container.width.get() } x { container.height.get() }
                    </Typography>
                </Tooltip>
                { bound && 
                    <Typography  variant='caption'>
                        ({ bound.width } x { bound.height })
                    </Typography>
                }
            </Box>
        </Paper>
    );
}