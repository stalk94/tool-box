import React from 'react';
import { DynamicFilter } from './type';
import {
    FormControlLabel,
    Checkbox,
    ToggleButtonGroup,
    ToggleButton,
    Slider,
    Typography,
    Box
} from '@mui/material';




export default function({ filters, values, onChange }) {

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {filters.map((filter) => {
                switch (filter.type) {
                    
                    case 'slider':
                        return (
                            <Box key={filter.id}>
                                <Typography>
                                    {filter.label}
                                </Typography>
                                <Slider
                                    value={values[filter.id] ?? filter.options.value}
                                    onChange={(_, val) => onChange(filter.id, val)}
                                    valueLabelDisplay="auto"
                                    min={filter.options.value[0]}
                                    max={filter.options.value[1]}
                                />
                            </Box>
                        );

                    case 'chekbox':
                        return (
                            <Box key={filter.id}>
                                <Typography>{filter.label}</Typography>
                                {filter.options.map((opt) => {
                                    const selected = values[filter.id] ?? (filter.multi ? [] : '');
                                    const checked = filter.multi
                                        ? selected.includes(opt.id)
                                        : selected === opt.id;

                                    const handleCheckboxChange = () => {
                                        if (filter.multi) {
                                            const newValue = checked
                                                ? selected.filter((v: string) => v !== opt.id)
                                                : [...selected, opt.id];
                                            onChange(filter.id, newValue);
                                        } else {
                                            onChange(filter.id, checked ? '' : opt.id);
                                        }
                                    };

                                    return (
                                        <FormControlLabel
                                            key={opt.id}
                                            control={<Checkbox checked={checked} onChange={handleCheckboxChange} />}
                                            label={opt.label}
                                        />
                                    );
                                })}
                            </Box>
                        );

                    case 'toggle':
                        return (
                            <Box key={filter.id}>
                                <Typography>{filter.label}</Typography>
                                <ToggleButtonGroup
                                    exclusive
                                    value={values[filter.id] ?? ''}
                                    onChange={(_, val) => onChange(filter.id, val)}
                                >
                                    {filter.options.map((opt) => (
                                        <ToggleButton key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>
                        );

                    default:
                        return null;
                }
            })}
        </Box>
    );
}