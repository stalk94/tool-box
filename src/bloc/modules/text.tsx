import React from 'react';
import { Typography } from '@mui/material';



export const TypographyWrapper = React.forwardRef((props: any, ref) => {
    const { fullWidth, ...any } = props;

    
    return(
        <Typography ref={ref} data-type="Typography" {...any}>
            { props.children }
        </Typography>
    );
});