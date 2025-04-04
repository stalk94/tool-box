import React from 'react';
import '../style/editor.css';
import { writeFile } from './plugins';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button, Box, useTheme, Badge, darken } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RestartAlt, Save, ExpandMore, ArrowBackIosNew, ArrowForwardIos  } from '@mui/icons-material';
import { LabelColor, LabelInput } from '../components/input/labels.inputs';
import { ColorPicker } from '../components/input/input.any';
import { palleteStd } from '../_theme/dark';
import colors from '../_theme/color.json';


const Tools =({ name, onChange, theme, onSaveFile })=> {
    const [story, setStory] = React.useState<Record<string, string>[]>([]);
    const [future, setFuture] = React.useState<Record<string, string>[]>([]);
    const [current, setCurrent] = React.useState<Record<string, string>>(null);

    const setTheme =(data: Record<string, string>)=> {
        Object.keys(data).forEach((key)=> 
            theme.palette[name][key] = data[key]
        );
        onChange(theme);
    }
    const undo = () => {
        if (story.length <= 1) return; // Nothing to undo
        
        // Take the current state and add it to future for potential redo
        setFuture(prev => [structuredClone(current), ...prev]);
        
        // Get the previous state from story
        const newStory = story.slice(0, -1);
        const previousState = structuredClone(newStory[newStory.length - 1]);
        
        // Update current state and apply it to the theme
        setCurrent(previousState);
        setTheme(previousState);
        
        // Update story array
        setStory(newStory);
    }
    const redo = () => {
        if (future.length === 0) return; // Nothing to redo
        
        // Get the next state from future
        const nextState = structuredClone(future[0]);
        const newFuture = future.slice(1);
        
        // Add current state to history before applying the next state
        setStory(prev => [...prev, structuredClone(current)]);
        
        // Update current state and apply it to the theme
        setCurrent(nextState);
        setTheme(nextState);
        
        // Update future array
        setFuture(newFuture);
    }
    const useSetDefault = () => {
        const defaultValues = structuredClone(palleteStd[name]);
        setCurrent(defaultValues);
        setTheme(defaultValues);
        
        // Add to history
        setStory(prev => [...prev, defaultValues]);
        setFuture([]);
    }
    const useAddStory = () => {
        // Only add to story if we have a current state and it's different from the last entry
        if (current && (story.length === 0 || JSON.stringify(current) !== JSON.stringify(story[story.length - 1]))) {
            setStory(prev => [...prev, structuredClone(current)]);
            setFuture([]);
        }
    }
    const useEdit = (key: string, newValue: string) => {
        const copy = structuredClone(current);
        copy[key] = newValue;
        
        // Update theme directly
        theme.palette[name][key] = newValue;
        
        // Update current state
        setCurrent(copy);
        onChange(theme);
    }
    
    React.useEffect(() => {
        console.log('RENDER');

        if(name && theme.palette[name]) {
            // Clone to avoid reference issues
            const currentPalette = structuredClone(theme.palette[name]);
            setStory([currentPalette]);
            setCurrent(currentPalette);
            setFuture([]);
        }
    }, [name]);
    
    return(
        <React.Fragment>
            <Box
                sx={{
                    p: 0.6,
                    pl: 1,
                    display:'flex',
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.1)',
                    height: 44,
                    borderTop: '1px solid #29292a79',
                    borderBottom: '1px solid #29292a79'
                }}
            >
                
                <Button
                    variant='outlined'
                    color='warning'
                    sx={{ borderStyle: 'dashed' }}
                    onClick={useSetDefault}
                >
                    <Badge
                        badgeContent='default'
                        sx={{
                            "& .MuiBadge-badge": {
                                color: "#f3b14fb2",
                                mt: 2.5,
                                mr: 1.2,
                                fontSize: "9px",
                            },
                        }}
                    >
                        <RestartAlt />
                    </Badge>
                </Button>
                
                <Button
                    variant='outlined'
                    sx={{ml: 0.5, borderStyle: 'dashed'}}
                    onClick={()=> onSaveFile(current)}
                    color='success'
                >
                    <Save />
                </Button>
                <Button 
                    sx={{ml:'auto'}} 
                    disabled={story.length <= 1}
                    onClick={undo}
                >
                    <ArrowBackIosNew />
                </Button>
                <Button
                    disabled={future.length === 0}
                    onClick={redo}
                >
                    <ArrowForwardIos />
                </Button>
            </Box>

            <Box sx={{ mx: 0.5 }}>
                { current && Object.keys(current).map((key, index)=> { 
                    return(
                        <LabelInput
                            key={index}
                            label={key + ':'}
                            position='left'
                            sx={{
                                fontSize: '14px'
                            }}
                        >
                            <ColorPicker
                                value={current[key]}
                                onChange={(value)=> {
                                    useEdit(key, value);
                                }}
                                onClose={()=> {
                                    useAddStory();
                                    // открытие менюшки
                                    document.querySelector('#TestButton')?.click();
                                }}
                                sx={{
                                    fontSize: '14px'
                                }}
                            />
                        </LabelInput>
                    );
                })}
            </Box>
        </React.Fragment>
    );
}

export default function({ test, name, dops }) {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [theme, setTheme] = React.useState(useTheme());
    const [render, setRender] = React.useState([]);
    const [open, setOpen] = React.useState(true);

    
    const useSaveFileConfig = (name, data) => {
        colors[name] = data;
        writeFile('src/_theme', 'color.json', JSON.stringify(colors, null, 4));
    }
    const updateThemeColors = (params) => {
        setTheme({...params});
        setRender([...test]);
    }
    React.useEffect(()=> {
        setRender(test);
    }, [test]);


    return(
        <ThemeProvider theme={theme}>
        <Box
            sx={{
                position: 'fixed',
                zIndex: 999,
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <Box
                sx={{
                    width: open ? '40%' : '5%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Button 
                    variant="outlined" 
                    color="inherit"
                    onClick={()=> setOpen(!open)}
                    sx={{height: 25, color: '#bcbcbc5c', my:0.5}}
                >
                    { open ? 'close' : 'open' }
                </Button>
                {/* область настроек */}
                { open &&
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: darken(theme.palette.background.paper, 0.2),
                            border: `1px solid ${theme.palette.divider}`,
                            borderLeft: 'none',
                            boxShadow: "inset 3px 0 5px rgba(0, 0, 0, 0.15)",
                            overflowY: "auto",
                            ...theme.elements.scrollbar
                        }}
                    >
                        <Accordion 
                            multiple
                            activeIndex={activeIndex} 
                            onTabChange={(e)=> setActiveIndex(e.index)}
                        >
                            <AccordionTab 
                                header={name}
                            >
                                <Tools 
                                    name={name} 
                                    theme={theme}
                                    onChange={updateThemeColors} 
                                    onSaveFile={(data)=> useSaveFileConfig(name, data)}
                                />
                            </AccordionTab>
                            
                        { dops &&
                            dops.map((elem, index)=> 
                                <AccordionTab key={index} header={elem}>
                                    <Tools 
                                        name={elem} 
                                        theme={theme}
                                        onChange={updateThemeColors} 
                                        onSaveFile={(data)=> useSaveFileConfig(elem, data)}
                                    />
                                </AccordionTab>
                            )
                        }
                        </Accordion>
                    </Box> 
                }
            </Box>
            {/* preview */}
            <Box
                sx={{
                    display:'flex',
                    flexDirection: 'column',
                    width:'100%',
                    p: 1
                }}
            >
                { render.map((elem, index)=>
                    React.cloneElement(elem, { 
                        key: index
                    })
                ) }
            </Box>
        </Box>
        </ThemeProvider>
    );
}