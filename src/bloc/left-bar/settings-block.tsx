import React from "react";
import { Box, Typography, Divider, Chip } from "@mui/material";
import { editorContext, infoSlice, cellsSlice } from "../context";
import { TextInput, CheckBoxInput, NumberInput, SliderInput, ToggleInput } from 'src/index';



export default function ({ category }) {
    const select = editorContext.currentCell.use();

    const setMetaName = React.useCallback((name: string) => {
        if (!select) return;
        if (name.length < 3) return;

        ['lg', 'md', 'sm', 'xs'].forEach((breackpoint) => {
            const c = editorContext.layouts[breackpoint].get();
            const findIndex = c.findIndex((l) => l.i === select.i);
            if (findIndex !== -1) {
                editorContext.layouts[breackpoint][findIndex].set((l) => {
                    l.metaName = name;
                    return l;
                });
            }
        });
    }, [select])


    return(
        <>
            <TextInput
                disabled={!select.i}
                label='meta name:'
                position='column'
                labelSx={{ fontSize: 14 }}
                style={{ maxHeight: 14, height: 16 }}
                value={select?.metaName ?? select.i}
                onChange={setMetaName}
            />
        </>
    );
}