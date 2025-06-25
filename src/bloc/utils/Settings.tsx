import React from 'react';
import { useSnackbar } from 'notistack';
import { Box, IconButton, Button } from "@mui/material";
import { RestartAlt, DragIndicator, ExpandMore, ExpandLess, Code, SettingsBackupRestore, } from '@mui/icons-material';
import { TextInput, CheckBoxInput, NumberInput, SliderInput, ToggleInput } from 'src/index';
import { editorContext, infoSlice, settingsSlice, cellsSlice, bufferSlice } from "../context";
import { updateComponentProps } from '../helpers/updateComponentProps';



const Size = () => {
    const select = infoSlice.select.content.use();
    const styleTgBtn: React.CSSProperties = { fontSize: '10px' }
    const settings = settingsSlice.panel.use();
    const style = React.useMemo(()=>  {
        if(!select) return ;

        const style = select.parent?.style ?? {};
        return style;
    }, [select]);


    const setResetSize =(key: string, any=false)=> {
        const copy = structuredClone(infoSlice.select.content.get());

        if(any) {
            delete copy.props.style?.width;
            delete copy.props.style?.height;
    
            updateComponentProps({
                component: copy,
                data: { style: copy.props.style }
            });
            infoSlice.select.content.set(copy);
        }
    }
    const render = React.useCallback((key: string) => {
        if(key === 'width' && select.props.fullWidth) return;
        
        const raw = style[key] ?? '0%';
        let current = 0;
        let usePercent = false;

        if (typeof raw === 'string') {
            usePercent = raw.trim().endsWith('%');
            current = parseFloat(raw);
        }
        else if (typeof raw === 'number') {
            current = raw;
        }
        
        return(
            <Box sx={{display:'flex', flexDirection:'row'}}>
                <SliderInput
                    label={`${key}:`}
                    position='left'
                    labelSx={{fontSize: 12}}
                    value={current}
                    max={100}
                    min={10}
                    style={{minWidth:'120px'}}
                    step={settings.stepSize}
                    onChange={(v)=> {
                        const copy = structuredClone(infoSlice.select.content.get());
                        if(!copy.props.style) copy.props.style = {};

                        copy.props.style[key] = usePercent ? `${v}%` : v;
                        updateComponentProps({
                            component: copy,
                            data: { style: copy.props.style }
                        });
                        infoSlice.select.content.set(copy);
                    }}
                />
                <IconButton color='error' size='mini' onClick={()=> setReset(key)}>
                    <RestartAlt />
                </IconButton>
            </Box>
        );
    }, [style, settings.stepSize]);
    


    return(
        <>
            <ToggleInput
                label='step:'
                position='left'
                labelSx={{fontSize: 14}}
                style={{ height: 26 }}
                value={String(settings.stepSize)}
                onChange={(v)=> settingsSlice.panel.stepSize.set(+v)}
                items={[
                    { id: '1', label: <span style={styleTgBtn}>x1</span> },
                    { id: '5', label: <span style={styleTgBtn}>x5</span> },
                    { id: '10', label: <span style={styleTgBtn}>x10</span> }
                ]}
            />
            <Box sx={{display:'flex',flexDirection:'row',p: 1, pt:2,ml:'auto'}}>
                <Button sx={{ml:1}} variant='outlined' size='mini' color='error' onClick={()=> setResetSize('', true)}>
                    <SettingsBackupRestore sx={{fontSize: 18}} /> <span style={{fontSize: 10}}>reset</span>
                </Button>
            </Box>
        </>
    );
}
const Padding = () => {
    const setResetPosition = (key: string, any = false) => {
        const copy = structuredClone(infoSlice.select.content.get());

        if (any) {
            delete copy.props.style?.marginTop;
            delete copy.props.style?.marginBottom;
            delete copy.props.style?.marginLeft;
            delete copy.props.style?.marginRight;

            updateComponentProps({
                component: copy,
                data: { style: copy.props.style }
            });
            infoSlice.select.content.set(copy);
        }
    }

    return(
        <>
            <Box sx={{display:'flex',flexDirection:'row',p: 1, pt:2,ml:'auto'}}>
                <Button variant='outlined' size='mini' color='error' onClick={()=> setResetPosition('', true)}>
                    <SettingsBackupRestore sx={{fontSize: 18}} /> <span style={{fontSize: 10}}>reset</span>
                </Button>
            </Box>
        
        </>
    );
}



export default function Settings({ activeCat }: { activeCat: 'size' | 'padding' }) {
    const select = infoSlice.select.content.use();


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {activeCat === 'size' && <Size />}
            {activeCat === 'padding' && <Padding />}
        </Box>
    );
}