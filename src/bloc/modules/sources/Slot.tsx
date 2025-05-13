import React from 'react';
import { ProxyComponentName } from '../../type';
import { useInfoState } from '../../context';
import { useHookstate } from '@hookstate/core';
import { Box, Button, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { usePopUpCustom } from '../../utils/usePopUp';
import { simpleComponents } from '../atoms';

type SimpleTypes = 'rating' | 'avatar' | '';
type PropsSimple = {
        id: string
        type: SimpleTypes
        [key: string]: any
}
type SlotType = {
    /** data-id родителя */
    idParent: string | number
    /** поддерживаемые компоненты */
    props?: PropsSimple
    containerStyle: React.CSSProperties
    onChange: (props: PropsSimple)=> void
}


export function Slot({ props, containerStyle, idParent, onChange }: SlotType) {
    const selectSlot = useHookstate(useInfoState().select.slot);
    const [rendered, setRendered] = React.useState<React.JSX.Element>();
    const { popover, handleOpen, handleClose } = usePopUpCustom(
        <Stack spacing={1}>
            {Object.keys(simpleComponents).map((type, index)=>
                <Box sx={{height: 40}} onClick={()=> create(type)}>
                    { simpleComponents[type].render() }
                </Box>
            )}
        </Stack>
    );

    const create =(type: SimpleTypes)=> {
        const cur = simpleComponents[type];
        onChange({
            id: idParent + String(Date.now()),
            type: type
        });

        // ! selectSlot
        setRendered(cur.render());
    }
    React.useEffect(()=> {
        if(props.type) {
            const cur = simpleComponents[props.type];
            if(cur) setRendered(cur.render(...props))
        }
    }, [props]);


    return(
        <div
            onClick={()=> {
                if(rendered) selectSlot.set({
                    id: props.id,
                    props,
                    source: simpleComponents[props.type]
                })
            }}
            style={{
                border: '1px solid',
                ...containerStyle
            }}
        >
            { rendered 
                ? <>
                    { rendered }
                  </>
                : (
                    <Button 
                        variant="outlined" 
                        color="inherit" 
                        onClick={(e)=> {
                            e.stopPropagation();
                            handleOpen(e);
                        }}
                    >
                        <Add />
                    </Button>
                )
            }
            { popover }
        </div>
    );
}