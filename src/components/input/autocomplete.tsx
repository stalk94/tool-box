import React from 'react';
import { Autocomplete, IconButton, TextField, useTheme } from '@mui/material';
import { InputPaper } from './atomize';
import { safeOmitInputProps } from '../hooks/omit';
import { ExpandMore } from '@mui/icons-material';
import { AutoCompleteProps } from './type';



export default function AutoCompleteInput({ options, value, onChange, placeholder, ...props }: AutoCompleteProps) {
    const [curvalue, setCurValue] = React.useState(value ?? '');
    const theme = useTheme();
    

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
    React.useEffect(()=> {
        if (typeof window === 'undefined') return;

        if(value) setCurValue(value);
    }, [value]);
    
    
    return (
        <InputPaper { ...props }>
            {props?.left &&
                <IconButton
                    disabled={props.disabled}
                    sx={{
                        color: theme.palette.action.active,
                    }}
                >
                    { props?.left }
                </IconButton>
            }

            <Autocomplete
                { ...filteredProps() }
                popupIcon={
                    <ExpandMore sx={{width:'80%'}} />
                }
                value={curvalue}
                options={options ?? []}
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
                slotProps={{
                    popupIndicator: {
                        sx: {
                            ...props?.styles?.icon,
                            '&:hover': {
                                opacity: 0.7
                            }
                        }
                    }
                }}
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
                            pl: props?.left ? 1 : 2,
                            pr: 1.5,
                            pt: 0.1,
                            flex: 1,
                            '& input': {
                                position: 'relative',
                                zIndex: 2,
                                background: 'transparent',
                                minHeight: 30,
                                fontSize: '0.9rem',
                                ...props?.styles?.form
                            },
                            '& input::placeholder, & textarea::placeholder': {
                                fontWeight: 200,
                                fontSize: '0.9rem',         // ≈ 14px
                                opacity: 0.3,
                                ...props?.styles?.placeholder
                            },
                            ...props.sx
                        }}
                    />
                )}
            />
        </InputPaper>
    );
}