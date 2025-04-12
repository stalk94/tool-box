import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, useTheme, Box, Dialog, Paper, Typography, Tooltip, IconButton, Menu as MenuPoup } from "@mui/material";
import { ContentFromCell, LayoutCustom } from './type';
import { Settings, Menu, Logout, VerifiedUser, Extension, Save } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { listAllComponents, listConfig } from './config/render';
import { useHookstate } from "@hookstate/core";
import SelectButton from "../components/popup/select.button";

type Props = {
    render: LayoutCustom []
    useEditProps: (component: ContentFromCell, data: Record<string, any>)=> void
}
export type ContentData = {
    id: number 
    type: 'Button' | 'IconButton' | 'Typography'
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
export const ToolBarInfo = ({ render, useEditProps }: Props) => {
    const [open, setOpen] = React.useState<undefined>();
    const [currentContentData, setCurrent] = React.useState<ContentData>();
    const [bound, setBound] = React.useState<DOMRect>();
    const select = useHookstate(infoState.select);
    //const allRefs = useHookstate(infoState.contentAllRefs);   // все ссылки компонентов
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
            <Box>
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
            <Box
                sx={{ml: 'auto', display: 'flex',}}
            >
                <span style={{marginRight:'5px',opacity:0.8}}>⊞</span> 
                <Tooltip title="ℹ размеры базового контейнера">
                    <Typography sx={{mr:1, color:'gold'}} variant='subtitle1'>
                        { container.width.get() } x { container.height.get() }
                    </Typography>
                </Tooltip>
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