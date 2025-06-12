import React from 'react';
import { useSnackbar } from 'notistack';
import { Box, IconButton, Button } from "@mui/material";
import { RestartAlt, DragIndicator, ExpandMore, ExpandLess, Code, SettingsBackupRestore, } from '@mui/icons-material';
import { TextInput, CheckBoxInput, NumberInput, SliderInput, ToggleInput } from 'src/index';
import { editorContext, infoSlice, settingsSlice, cellsSlice, bufferSlice } from "../context";
import { updateComponentProps } from '../helpers/updateComponentProps';
import { useKeyboardListener } from '@bloc/helpers/hooks';
import { setPadding } from '@bloc/helpers/hotKey';


type SettingsProps = {
   
}
const category = [{
    id: 'layer',
    label: <span style={{fontSize: 10}}>block</span>
},{
    id: 'position',
    label: <span style={{fontSize: 10}}>position</span>
},{
    id: 'size',
    label: <span style={{fontSize: 10}}>size</span>
}];


const Position = () => {
    const select = infoSlice.select.content.use();
    const styleTgBtn: React.CSSProperties = { fontSize: '10px' }
    const settings = settingsSlice.panel.use();
    const style = React.useMemo(()=>  {
        if(!select) return ;

        const style = select.parent?.style ?? {};
        return style;
    }, [select]);

    const setReset =(key: string, any=false)=> {
        const copy = structuredClone(infoSlice.select.content.get());

        if(any) {
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
            <ToggleInput
                label='step:'
                position='left'
                labelSx={{fontSize: 12}}
                value={String(settings.stepPosition)}
                onChange={(v)=> settingsSlice.panel.stepPosition.set(+v)}
                items={[
                    { id: '1', label: <span style={styleTgBtn}>x1</span> },
                    { id: '5', label: <span style={styleTgBtn}>x5</span> },
                    { id: '10', label: <span style={styleTgBtn}>x10</span> }
                ]}
            />
            <Button sx={{mt:1, ml:'70%'}} size='mini' color='error' onClick={()=> setReset('', true)}>
                <SettingsBackupRestore />
            </Button>
        </>
    );
}
const Size = () => {
    const select = infoSlice.select.content.use();
    const styleTgBtn: React.CSSProperties = { fontSize: '10px' }
    const settings = settingsSlice.panel.use();
    const style = React.useMemo(()=>  {
        if(!select) return ;

        const style = select.parent?.style ?? {};
        return style;
    }, [select]);


    const setReset =(key: string, any=false)=> {
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
                labelSx={{fontSize: 12}}
                value={String(settings.stepSize)}
                onChange={(v)=> settingsSlice.panel.stepSize.set(+v)}
                items={[
                    { id: '1', label: <span style={styleTgBtn}>x1</span> },
                    { id: '5', label: <span style={styleTgBtn}>x5</span> },
                    { id: '10', label: <span style={styleTgBtn}>x10</span> }
                ]}
            />
            
            <Button sx={{mt:1, ml:'70%'}} size='mini' color='error' onClick={()=> setReset('', true)}>
                <SettingsBackupRestore />
            </Button>
        </>
    );
}
const Layer = () => {
    const select = editorContext.currentCell.use();

    const setMetaName = React.useCallback((name: string)=> {
        if(!select) return;
        if(name.length < 3) return;

        ['lg', 'md', 'sm', 'xs'].forEach((breackpoint)=> {
            const c = editorContext.layouts[breackpoint].get();
            const findIndex = c.findIndex((l)=> l.i === select.i);
            if(findIndex !== -1) {
                editorContext.layouts[breackpoint][findIndex].set((l)=> {
                    l.metaName = name;
                    return l;
                });
            }
        });
    }, [select])
    

    return(
        <>
            <TextInput
                label='meta name:'
                position='left'
                labelSx={{fontSize: 12}}
                style={{height: 15}}
                value={select?.metaName ?? select.i}
                onChange={setMetaName}
            />
        </>
    );
}

export default function Settings({  }: SettingsProps) {
    const [activeCat, setActiveCat] = React.useState<'size'|'position'|'layer'>('position');
    const [colapsed, setColapsed] = React.useState(false);
    const select = infoSlice.select.content.use();
    
    useKeyboardListener((key)=> {
        if (key === 'Tab') setColapsed(p => !p);
    });
    React.useEffect(()=> {
        if(!select) return;

        const handleCell = () => setActiveCat('layer');
        //EVENT.on('onSelectCell', handleCell);

        return ()=> {
            //EVENT.off('onSelectCell', handleCell);
        }
    }, []);

    return(
         <>
            { select && (
                <div
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column', 
                        top: '7%',
                        right: '0%',
                        zIndex: 99999,
                        background: 'rgb(58, 58, 58)',
                        boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(8px)',
                        color: 'white',
                        borderRadius: 4,
                        minWidth: !colapsed ? '12%' : 0
                    }}
                >
                    <Box sx={{display:'flex', width:'100%', height: '25px', background:'rgba(0, 0, 0, 0.3)'}}>
                        <IconButton size="small" onClick={()=> setColapsed(p => !p)}>
                            {colapsed
                                ? <ExpandMore sx={{ color: '#aaa', fontSize: 14 }} />
                                : <ExpandLess sx={{ color: '#aaa', fontSize: 14 }} />
                            }
                        </IconButton>
                    </Box>
                    { !colapsed && select &&
                        <Box sx={{px: 0, pb: 1}}>
                            <ToggleInput
                                style={{height: 12}}
                                value={activeCat}
                                items={category}
                                onChange={setActiveCat}
                            />
                            <Box sx={{display: 'flex', flexDirection: 'column', pt: 2}}>
                                { activeCat === 'size' && <Size /> }
                                { activeCat === 'position' && <Position /> }
                                { activeCat === 'layer' && <Layer /> }
                            </Box>
                        </Box>
                    }
                </div>
            )}
        </>
    );
}