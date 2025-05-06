import React from 'react';
import { Button, IconButton } from '@mui/material';
import { iconsList } from '../../components/tools/icons';
import { Settings } from '@mui/icons-material';



export const IconButtonWrapper = React.forwardRef((props: any, ref) => {
    const { icon, children, fullWidth, style, ...otherProps } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : Settings;

    return (
        <IconButton
            ref={ref}
            data-type="IconButton"
            style={style}
            {...otherProps}
        >
            <Icon />
        </IconButton>
    );
});


export const ButtonWrapper = React.forwardRef((props: any, ref) => {
    const { startIcon, endIcon, children, style, ...otherProps } = props;
    const StartIcon = startIcon && iconsList[startIcon] ? iconsList[startIcon] : null;
    const EndIcon = endIcon && iconsList[endIcon] ? iconsList[endIcon] : null;
    

    return (
        <Button
            ref={ref}
            data-type="Button"
            variant="outlined"
            startIcon={StartIcon ? <StartIcon /> : undefined}
            endIcon={EndIcon ? <EndIcon /> : undefined}
            style={style}
            { ...otherProps }
        >
            { children }
        </Button>
    );
});