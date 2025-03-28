import React from 'react';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import { ArrowDropDown } from '@mui/icons-material';
import { alpha, darken, lighten, Avatar, Button, Grid2, Stack } from '@mui/material';
import GridEditor from '../grid/grid-editor';
import In from '../input/input';
import BasePopUp from '../popup/base';


export default function({ components }) {
    const [all, setAll] = React.useState<Record<string, Layout[]>>({});
    const [layout, setLayout] = React.useState<Layout[]>([]);
    const [name, setName] = React.useState<string>('component-0');

   
    const useChangeElement =(item: {label:string,id:string})=> {
        if(all[item.label]) setLayout(all[item.label]);
        setName(item.label);
    }
    const getList =()=> {
        const result = [];

        Object.keys(all).forEach((key)=> {
            result.push({
                label: key,
                id: key,
            });
        });

        return result;
    }
    //! Вынести отдельно как провайдер данных
    const handlerSave =()=> {
        setAll((all)=> {
            const newList = {...all, [name]: layout};
            localStorage.setItem('GRIDS', JSON.stringify(newList));

            return newList;
        });
    }
    //! Вынести отдельно как провайдер данных
    React.useEffect(()=> {
        const cache = localStorage.getItem('GRIDS');

        if(cache) {
            const loadData = JSON.parse(cache);
            const curName = Object.keys(loadData).pop();
            setAll(loadData);
            setName(curName ?? 'component-'+Object.keys(loadData).length);
            setLayout(loadData[curName]);
        }
    }, []);
 
    
    return(
        <div style={{width: '100%', height: '100%', display:'flex', flexDirection:'row'}}>
            <GridEditor 
                layout={layout}
                setLayout={setLayout}
                renderItems={components ?? []}
                tools={
                    <Stack direction="row" spacing={1}>
                        <div style={{ padding: '5px' }}>
                            <In.Input
                                type='text'
                                value={name}
                                onChange={setName}
                                right={
                                    <BasePopUp 
                                        onSelect={useChangeElement}
                                        items={getList()}
                                    >
                                        <ArrowDropDown />
                                    </BasePopUp>
                                   
                                }
                            />
                        </div>
                        <Button
                            onClick={() => handlerSave()}
                            sx={{ my: 1, ml: 1 }}
                        >
                            save
                        </Button>
                        <Button
                            //disabled={disabled}
                            sx={{ my: 1, ml: 1 }}
                        >
                            import
                        </Button>
                    </Stack>
                }
            />
        </div>
    );
}