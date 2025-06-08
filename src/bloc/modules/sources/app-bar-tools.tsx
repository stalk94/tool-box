import React from 'react';
import { Drawer, Button, Box, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { TextInput, Accordion } from '../../../index';

type LinkItems = {
    id: string
    label?: string
    icon?: React.ReactNode
    divider?: React.ReactNode | boolean
    /** ℹ️ можно передавать доп данные элемента */
    state?: {
        badge?: number | React.ReactNode
    }
    /** вложенные элементы */
    children?: LinkItems[]
    style?: React.CSSProperties
}
type Props = {
    open: boolean
    data: {
        linkItems: LinkItems[]
    }
    setOpen: (v: boolean)=> void
    onChange: (data: {linkItems: LinkItems[]})=> void
}


export default function({ open, data, setOpen, onChange }: Props) {
    const [dataCopy, setDataCopy] = React.useState<LinkItems[]>([]);
    
    const render =(elem, i: number, nested?: number)=> {
        return(
            <div style={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection:'column' }}>
                    <TextInput
                        label=' '
                        position='right'
                        labelSx={{ fontSize: 14, color: '#c3c3c3' }}
                        value={elem.id}
                        left={<span style={{fontSize: 12,opacity:0.7}}>path&nbsp;</span>}
                        sx={{
                            background: '#0000000',
                            backgroundColor: '#0000000',
                            height: 20,
                            fontSize: 14
                        }}
                        onChange={(v) => setDataCopy((old) => {
                            const next = [...old];
                            if(nested !== undefined) next[i].children[nested] = { 
                                ...next[i].children[nested], 
                                id: v 
                            };
                            else next[i] = { ...next[i], id: v };

                            return next;
                        })}
                    />
                    <TextInput
                        label=' '
                        position='right'
                        labelSx={{ fontSize: 14, color: '#c3c3c3' }}
                        value={elem.label ?? elem.id}
                        sx={{
                            background: '#0000000',
                            backgroundColor: '#0000000',
                            height: 20,
                            fontSize: 14
                        }}
                        left={<span style={{fontSize: 12,opacity:0.7}}>label</span>}
                        onChange={(v) => setDataCopy((old) => {
                            const next = [...old];
                            if(nested !== undefined) next[i].children[nested] = { 
                                ...next[i].children[nested], 
                                label: v 
                            };
                            else next[i] = { ...next[i], label: v };

                            return next;
                        })}
                    />
                </Box>
                <Button
                    size='mini'
                    variant='outlined'
                    color='error'
                    sx={{ mx: 1, height: 25}}
                    onClick={() => {
                        setDataCopy((old) => {
                            if(nested !== undefined) {
                                old[i].children = old[i].children.filter((e, i) => i !== nested);
                                return [...old];
                            }
                            else return old.filter((e) => e.id !== elem.id);
                        })
                    }
                    }
                >
                    x
                </Button>
            </div>
        );
    }
    React.useEffect(()=> {
        setDataCopy(JSON.parse(JSON.stringify(data.linkItems)))
    }, [data]);


    return(
        <Drawer 
            sx ={{
                backdropFilter: 'blur(6px)',
            }}
            slotProps={{
                paper: {
                    elevation: 3,
                    sx: {
                        background: 'rgb(44, 44, 44)',
                    },
                },
            }}
            anchor="left" 
            open={open}
            onClose={(e, v)=> {
                setOpen(false);
                onChange({
                    linkItems: dataCopy
                });
            }}
        >
            {dataCopy.map((elem, i)=> 
                <>
                    <Divider
                        children={
                            <Typography
                                variant='caption'
                            >
                                { elem.label }
                            </Typography>
                        }
                    />
                    <div style={{display:'flex', flexDirection:'column',padding: 8}}>
                        <Box key={i} sx={{my: 1}}>
                            { render(elem, i) }
                            <Box sx={{display:'flex', flexDirection:'column', ml: 5, mt:1}}>
                                {elem.children &&
                                    <Accordion
                                        items={elem.children?.map((nested, index)=> {
                                            return({
                                                title: nested.label ?? nested.id,
                                                content: render(nested, i, index)
                                            })
                                        })}
                                    />
                                }
                                <Button
                                    size='mini'
                                    variant='outlined'
                                    color='success'
                                    sx={{ml: 16, height: 25, mt: 2 }}
                                    onClick={() => {
                                        setDataCopy((old) => {
                                            if(!old[i].children) old[i].children = [{
                                                id: `${elem.id}_0`,
                                                label: `${elem.id}-0`
                                            }];
                                            else old[i].children.push({
                                                id: `${elem.id}_${old[i].children.length}`,
                                                label: `${elem.id}-${old[i].children.length}`
                                            });
                                            
                                            return [...old];
                                        });
                                    }}
                                >
                                    add nested
                                </Button>
                            </Box>
                        </Box>
                    </div>
                </>
            )}
            <Divider/>
            <Button
                size='mini'
                variant='outlined'
                color='inherit'
                sx={{ mx: 1, height: 25, mt: 2 }}
                onClick={() => {
                    setDataCopy((old) => [
                        ...old,
                        {
                            id: `navigation_${old.length}`,
                            label: `navigation-${old.length}`
                        }
                    ]);
                }}
            >
                add nested
            </Button>
        </Drawer>
    );
}
