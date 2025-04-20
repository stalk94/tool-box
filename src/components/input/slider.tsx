import React from 'react';
import { Box, Grid2, Slider, SliderProps, useTheme } from '@mui/material';
import Input from '@mui/material/Input';


export type CustomSliderProps = SliderProps & {
    value?: number|number[]
    onChange: (value: number|number[])=> void,
    start?: React.ReactNode
    end?: React.ReactNode
    styles: {
        thumb: React.CSSProperties,
        track: React.CSSProperties,
        rail: React.CSSProperties
    }
}


export default function({ value, onChange, start, end, ...props }: CustomSliderProps) {
    const theme = useTheme();
    const [curValue, setCurValue] = React.useState(0);
    const style = {
        color: '#00000000',
        '& .MuiSlider-thumb': {
            backgroundColor: theme.palette.slider.thumb,  // Цвет "пальца" ползунка
            border:`1px solid`,
            ...props?.styles?.thumb,
        },
        '& .MuiSlider-track': {
            backgroundColor: theme.palette.slider.track,  // Цвет пути ползунка
            ...props?.styles?.track,
        },
        '& .MuiSlider-rail': {
            backgroundColor: theme.palette.slider.rail,  // Цвет "рельсы" (основной фон)
            border: '1px solid',
            ...props?.styles?.rail
        }
    }
    

    const useFiltre =()=> {
        delete props.position;
        delete props.error;
        delete props.success;
        delete props.diapasone;
        delete props.markStep;
        delete props.mark;
        delete props.sx;
        delete props.labelSx;

        return props;
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? 0 : Number(event.target.value);

        if(!props.max) props.max = 100;
        if(props.min === undefined) props.min = 0;
        
        if(Array.isArray(curValue)) {
            if(curValue[0] < newValue) {
                if(newValue < props.max) handlerChange([curValue[0], newValue]);
            }
            else handlerChange([curValue[0], curValue[0] + 1]);
        }
        else handlerChange(newValue);
    }
    const handlerChange = (newValue) => {
        setCurValue(newValue);
        onChange && onChange(newValue);
    }
    React.useEffect(()=> {
        if(value !== undefined) setCurValue(value)
    }, [value]);


    if(!start && !end) return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                opacity: props.disabled && 0.5,
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
                    ml: 1,
                    ...style,
                    ...props.sx
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
            sx={{ 
                alignItems: 'center', 
                opacity: props.disabled && 0.5,
            }}
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
                        ...style,
                        ...props.sx
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
                            disableUnderline
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