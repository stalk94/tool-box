import { infoSlice } from '../context';
import React from 'react';



export const useSelectSlot = () => {
    const info = infoSlice.get();
    const selectSlot = info.select.slot;


    React.useEffect(()=> {
        console.log(selectSlot)
    }, [selectSlot]);

    return selectSlot
}