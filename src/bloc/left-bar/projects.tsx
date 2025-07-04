import React from "react";
import { Button, IconButton, Box, Typography, Divider, Select, MenuItem} from "@mui/material";
import {
    Settings, AccountTree, Logout, Palette, Extension, Save, Functions,
    RadioButtonUnchecked, RadioButtonChecked, Add, Code
} from "@mui/icons-material";
import { editorContext, infoSlice, cellsSlice, settingsSlice } from "../context";
import { db } from "../helpers/export";
import { usePopUpName, useSafeAsyncEffect } from '../helpers/usePopUp';
import { getUniqueBlockName } from "../helpers/editor";



export default function () {
    const baseCtx = settingsSlice.base.use();
    const [configNames, setConfigNames] = React.useState([]);

    React.useEffect(()=> {
        db.get('configs').then((configs) => {
            if (configs) setConfigNames(Object.keys(configs));
        });
    }, []);

    return(
        <Select
            size="small"
            value={baseCtx.select ?? 'test'}
            onChange={(e) => settingsSlice.base.select.set(e.target.value)}
            displayEmpty
            sx={{ fontSize: 14, height: 36, color: '#ccc', background: '#2a2a2a84', ml: 1, mt: 0.3 }}
        >
            {configNames.map((key) => (
                <MenuItem key={key} value={key} >
                    {key}
                </MenuItem>
            ))}
        </Select>
    )
}