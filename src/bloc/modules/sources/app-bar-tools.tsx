import React from 'react';
import { Drawer, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import { TextInput, CheckBoxInput, NumberInput, SelectInput, Modal } from '../../../index';

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
        console.log(elem)
        return(
            <div style={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection:'column' }}>
                    <TextInput
                        label='path'
                        position='right'
                        labelSx={{ fontSize: 14, color: '#000000cb' }}
                        value={elem.id}
                        onChange={(v) => setDataCopy((old) => {
                            if(nested !== undefined) old[i].children[nested].id = v;
                            else old[i].id = v;

                            return [...old];
                        })}
                    />
                    <TextInput
                        label='label'
                        position='right'
                        labelSx={{ fontSize: 14, color: '#000000cb' }}
                        value={elem.label ?? elem.id}
                        onChange={(v) => setDataCopy((old) => {
                            if(nested !== undefined) old[i].children[nested].label = v;
                            else old[i].label = v;

                            return [...old];
                        })}
                    />
                </Box>
                <Button
                    size='mini'
                    variant='outlined'
                    color='error'
                    sx={{ mx: 1, height: 40}}
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
                <div style={{display:'flex', flexDirection:'column',padding: 8}}>
                    <Box key={elem.id} sx={{my: 1}}>
                        { render(elem, i) }
                        <Box sx={{display:'flex', flexDirection:'column', ml: 5}}>
                            {elem.children?.map((nested, index)=>
                                <Box key={nested.id} 
                                    sx={{
                                        display: 'flex',
                                        border: '1px solid black'
                                    }}
                                >
                                    { render(nested, i, index) }
                                </Box>
                            )}
                            <Button
                                size='mini'
                                variant='outlined'
                                color='success'
                                sx={{ mx: 1, height: 20 }}
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
            )}
        </Drawer>
    );
}