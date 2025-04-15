import React from 'react';
import { Typography } from '@mui/material';



export const TypographyWrapper = React.forwardRef((props: any, ref) => (
    <Typography ref={ref} data-type="Typography" {...props}>
        { props.children }
    </Typography>
));