import React from 'react';
import { Box, Grid2, Slider, SliderProps } from '@mui/material';
import Input from '@mui/material/Input';


export type CustomSliderProps = SliderProps & {
    value?: number|number[]
    onChange: (value: number|number[])=> void,
    start?: React.ReactNode
    end?: React.ReactNode
}


// todo: добавить стилизацию
export default function({ value, onChange, start, end, ...props }: CustomSliderProps) {
    const [curValue, setValue] = React.useState(10);

    const useFiltre =()=> {
        delete props.position;
        delete props.error;
        delete props.success;
        delete props.diapasone;
        delete props.markStep;
        delete props.mark;
        delete props.sx;

        return props;
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? 0 : Number(event.target.value);

        if(Array.isArray(curValue)) {
            if(curValue[0] < newValue) handlerChange([curValue[0], newValue]);
            else handlerChange([curValue[0], curValue[0] + 1]);
        }
        else handlerChange(newValue);
    }
    const handlerChange =(newValue: number|number[])=> {
        setValue(newValue);
        onChange && onChange(newValue);
    }
    React.useEffect(()=> {
        if(value!==undefined) setValue(value);
    }, [value]);


    if(!start && !end) return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                ...props.sx
            }}
        >
             <Slider
                value={curValue}
                valueLabelDisplay="auto"
                size='medium'
                defaultValue={10}
                sx={{
                    minWidth: 80,
                    maxWidth: '95%',
                }}
                { ...useFiltre() }
                onChange={(e, v) => handlerChange(v)}
            />
        </Box>
    );
    else return(
        <Grid2
            container
            spacing={2}
            sx={{ alignItems: 'center', ...props.sx }}
        >
            {start &&
                <Grid2>
                    { start }
                </Grid2>
            }

            <Grid2 size="grow">
                <Slider
                    value={curValue}
                    valueLabelDisplay="auto"
                    size='medium'
                    defaultValue={10}
                    sx={{
                        mt: 1,
                        minWidth: 80,
                    }}
                    { ...useFiltre() }
                    onChange={(e, v) => handlerChange(v)}
                />
            </Grid2>
            {/*  */}
            {end &&
                <Grid2>
                    {end === true
                        ? <Input
                            disabled={props.disabled}
                            value={Array.isArray(curValue) ? curValue[1] : curValue}
                            onChange={handleInputChange}
                            size="small"
                            sx={{
                                width: 42,
                                "& input": {
                                    textAlign: "center", // Выравнивание текста по центру
                                },
                                "& input[type=number]": {
                                    MozAppearance: "textfield",
                                },
                                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                }
                            }}
                            inputProps={{
                                step: props.step ?? 1,
                                min: props.min ?? 0,
                                max: props.max ?? 100,
                                type: 'number'
                            }}
                        />
                        : end
                    }
                </Grid2>
            }
        </Grid2>
    );
}