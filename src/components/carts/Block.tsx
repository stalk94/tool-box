import React from "react";
import { Grid2, Paper, PaperProps, useMediaQuery } from '@mui/material';

type Props = PaperProps & {
    /**  
     * `12x6x6` - первая колонка всю `высоту` слева займет и две по половине ширины справа
     * `6x6x12` - наоборот
     * `6x6` - две колонки по половине
    */
    variant?: '12x6x6' | '6x6x12' | '6x6'
    /** 
     * использовать мобильное преобразование 
     * 6x6 перестроится в колонку
     * 
    */
    isMobail?: false 
}


export default function Block({ children, variant, isMobail, ...props }: Props) {
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const renderLayoutD = () => {
        switch (variant) {
            case '12x6x6':
                return (
                    <Grid2 container sx={{ height: '100%', width: '100%' }}>
                        <Grid2 size={{ xs: 6 }}>{children[0]}</Grid2>
                        <Grid2
                            container
                            direction="column"
                            size={{ xs: 6 }}
                            sx={{ height: '100%' }}
                        >
                            <Grid2 size={{ xs: 12 }} sx={{ height: '50%' }}>
                                {children[1]}
                            </Grid2>
                            <Grid2 size={{ xs: 12 }} sx={{ height: '50%' }}>
                                {children[2]}
                            </Grid2>
                        </Grid2>
                    </Grid2>
                );

            case '6x6x12':
                return (
                    <Grid2 container sx={{ height: '100%', width: '100%' }}>
                        <Grid2
                            container
                            direction="column"
                            size={{ xs: 6 }}
                            sx={{ height: '100%' }}
                        >
                            <Grid2 size={{ xs: 12 }} sx={{ height: '50%' }}>
                                {children[0]}
                            </Grid2>
                            <Grid2 size={{ xs: 12 }} sx={{ height: '50%' }}>
                                {children[1]}
                            </Grid2>
                        </Grid2>
                        <Grid2 size={{ xs: 6 }}>{children[2]}</Grid2>
                    </Grid2>
                );

            case '6x6':
                return (
                    <Grid2 container sx={{ height: '100%', width: '100%' }}>
                        <Grid2 size={{ xs: 6 }} sx={{ height: '100%' }}>
                            {children[0]}
                        </Grid2>
                        <Grid2 size={{ xs: 6 }} sx={{ height: '100%' }}>
                            {children[1]}
                        </Grid2>
                    </Grid2>
                );

            default:
                return <div>Неверная конфигурация</div>;
        }
    }
    const renderLayoutM = () => {
        switch (variant) {
            case '12x6x6':
                return (
                    <Grid2 container sx={{ height: '100%', width: '100%' }}>
                        <Grid2 size={{ xs: 12 }}>
                            {children[0]}
                        </Grid2>
                        <Grid2 size={{ xs: 6 }}>
                            {children[1]}
                        </Grid2>
                        <Grid2 size={{ xs: 6 }}>
                            {children[2]}
                        </Grid2>
                    </Grid2>
                );

            case '6x6x12':
                return (
                    <Grid2 container sx={{ height: '100%', width: '100%' }}>
                        <Grid2 size={{ xs: 6 }}>
                            {children[0]}
                        </Grid2>
                        <Grid2 size={{ xs: 6 }}>
                            {children[1]}
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                            {children[2]}
                        </Grid2>
                    </Grid2>
                );

            case '6x6':
                return (
                    <Grid2 container sx={{ height: '100%', width: '100%' }}>
                        <Grid2 size={{ xs: 12 }}>
                            {children[0]}
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                            {children[1]}
                        </Grid2>
                    </Grid2>
                );

            default:
                return <div>Неверная конфигурация</div>;
        }
    }



    return (
        <Paper 
            elevation={props.elevation ?? 0}
            sx={{
                p: 5,
                borderRadius: 5,
                border: (theme)=> `1px solid ${theme.palette.card.border}`,
                width: '100%',
                height: '100%',
                ...props.sx,
            }}
        >
            { variant &&
                (isMobail && isSmallScreen)
                    ? renderLayoutM()
                    : renderLayoutD()
            }
            { !variant &&  children }
        </Paper>
    );
}