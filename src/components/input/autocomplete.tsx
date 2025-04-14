import React from 'react';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { InputPaper } from './atomize';
import Text, { BaseInputProps } from './text';


export type AutoCompleteOption = string | { label: string; id: string };
export type AutoCompleteProps = Omit<AutocompleteProps<any, boolean, boolean, boolean>, 'renderInput'> & {
    label?: React.ReactNode;
    position?: 'left' | 'right' | 'column';
    options: AutoCompleteOption[];
    value?: any;
    onChange?: (value: any) => void;
    placeholder?: string;
}


export default function AutoCompleteInput({ options, value, onChange, placeholder, ...props }: AutoCompleteProps) {
    return (
        <Autocomplete
            {...props}
            value={value}
            options={options}
            fullWidth
            disableClearable
            onChange={(event, val) => onChange?.(val)}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
            }
            isOptionEqualToValue={(opt, val) =>
                typeof opt === 'string'
                    ? opt === val
                    : typeof val === 'string'
                        ? opt.label === val
                        : opt.id === val.id
            }
            renderInput={(params) => (
                <Text
                    {...props}
                    {...params}
                    placeholder={placeholder}
                    value={params.inputProps.value}
                    onChange={(v) => {
                        if (params.inputProps.onChange) {
                            params.inputProps.onChange({ target: { value: v } } as any);
                        }
                    }}
                />
            )}
        />
    );
}