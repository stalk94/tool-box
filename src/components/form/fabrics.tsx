import React from 'react';
import { LabelText, LabelNumber, LabelColor, LabelSlider, LabelSelect, LabelToogler, 
    LabelDateOrTime, LabelFileLoader, LabelAutocomplete, LabelComboFileLoader
} from '../input/labels.inputs';
import { SwitchInput, CheckBoxInput } from '../input/input.any';
import { Schema, TypeSchema } from './types';
import { Divider, Typography } from '@mui/material';


const DividerWrap = ({ children, ...props }) => (
    <Divider
        flexItem
        variant='fullWidth'
        { ...props }
    >
        <Typography
            variant='subtitle2'
        >
            { children }
        </Typography>
    </Divider>
);


export const fabricsInput: Record<TypeSchema, (schema: any) =>  React.JSX.Element> = {
    text: (schema) => <LabelText {...schema} />,
    number: (schema) => <LabelNumber {...schema} />,
    color: (schema) => <LabelColor {...schema} />,
    slider: (schema) => <LabelSlider {...schema} />,
    switch: (schema) => <SwitchInput {...schema} />,
    toggle: (schema) => <LabelToogler {...schema} />,
    date: (schema) => <LabelDateOrTime type='date' {...schema} />,
    time: (schema) => <LabelDateOrTime type='time' {...schema} />,
    select: (schema) => <LabelSelect {...schema} />,
    checkbox: (schema) => <CheckBoxInput {...schema} />,
    file: (schema) => <LabelFileLoader {...schema} />,
    'file-combo': (schema)=> <LabelComboFileLoader {...schema} />,
    autocomplete: (schema) => <LabelAutocomplete {...schema} />,
    divider: (schema) => <DividerWrap {...schema} />
}