import React from "react";
import { LayoutCustom, Breakpoint } from '../type';
import { Bar } from '@lib/index';
import { editorContext, infoSlice, cellsSlice } from "../context";


const CellsPreview = () => {
    const layoutsState = editorContext.layouts.use();
    const currentBreakpoint = editorContext.size.breackpoint.use();
    const sizes = { lg: 1100, md: 950, sm: 590, xs: 480 };


    const getCells = React.useMemo(()=> {
        const curentWidth = sizes[currentBreakpoint];


    }, [currentBreakpoint]);


    return(
        <>

        </>
    );
}

export default function RightBar() {


    return(
        <Bar
            elevation={2}
            style={{
                visibility: 'hidden',
                position: 'fixed',
                zIndex: 999,
                width: '5%',
                right: 0,
                top: 65,
                height: 'calc(100% - 65px)',
                background:'rgb(54, 54, 54)',
            }}
            start={
                <>...</>
            }
        >
            
        </Bar>
    );
}