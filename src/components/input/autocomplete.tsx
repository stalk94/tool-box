import React from 'react';
import { Autocomplete, AutocompleteProps, IconButton, TextField, useTheme } from '@mui/material';
import { InputPaper } from './atomize';
import { safeOmitInputProps } from '../hooks/omit';


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
    const theme = useTheme();
    const placeholderStyle = {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.9rem',         // ≈ 14px
        //fontStyle: 'italic',
        lineHeight: 1.43,
        letterSpacing: '0.01071em'
    }

    const filteredProps = () => {
        const clone = safeOmitInputProps(props, [
            'borderStyle',
            'success',
            'toolVisible',
            'labelSx',
            'position',
            'diapasone',
            'markStep',
            'mark',
            'error'
        ]);

        if (clone.type !== 'password') delete clone.type;
        return clone;
    }


    return (
        <InputPaper { ...props }>

            <IconButton
                disabled={props.disabled}
                sx={{
                    color: theme.palette.action.active,
                }}
            >
                { props.left }
            </IconButton>

            <Autocomplete
                { ...filteredProps() }
                value={value}
                options={options ?? []}
                fullWidth
                disableClearable
                onChange={(event, val) => {
                    onChange?.(val)
                }}
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
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        variant="standard"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                        }}
                        sx={{
                            width: '100%',
                            minWidth: '60px',
                            minHeight: '38px',
                            background: 'transparent',
                            padding: 0,
                            pl: props.left ? 1 : 2,
                            pr: 2,
                            pt: 0.1,
                            flex: 1,
                            '& input': {
                                position: 'relative',
                                zIndex: 2,
                                background: 'transparent',
                                minHeight: 30,
                                //border: '1px solid red',
                            },
                            '& input::placeholder, & textarea::placeholder': placeholderStyle,
                            ...props.sx
                        }}
                    />
                )}
            />
        </InputPaper>
    );
}