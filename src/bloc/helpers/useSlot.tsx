import { useHookstate } from '@hookstate/core';
import { useInfoState } from '../context';
import React from 'react';



export const useSelectSlot = () => {
    const info = useHookstate(useInfoState());
    const selectSlot = info.select.slot;


    React.useEffect(()=> {
        console.log(selectSlot.get({noproxy: true}))
    }, [selectSlot]);

    return selectSlot
}