import React from 'react'
import { Button, IconButton, Typography } from "@mui/material"
import { propsButton, propsIconButton, propsTypography } from './props';
import { Settings } from '@mui/icons-material';
import { iconsList } from '../../components/tools/icons';


const IButtonWrupper = React.forwardRef((props, ref) => {
    const { icon, ...otherProps } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : Settings;

    return (                        
        <IconButton 
            ref={ref}
            data-type='IconButton'
            icon='Settings'
            {...props}
        >
            <Icon />
        </IconButton>
    );
});
const ButtonWrupper = React.forwardRef((props, ref) => {
    const { startIcon, endIcon, ...otherProps } = props;
    const StartIcon = startIcon && iconsList[startIcon] ? iconsList[startIcon] : undefined;
    const EndIcon = endIcon && iconsList[endIcon] ? iconsList[endIcon] : undefined;

    return (                        
        <Button 
            ref={ref}
            data-type='Button'
            variant='outlined'
            startIcon={StartIcon ? <StartIcon /> : undefined}
            endIcon={EndIcon ? <EndIcon /> : undefined}
            { ...otherProps }
        >
            { props.children }
        </Button>
    );
});



export const listAllComponents = {
    Button: ButtonWrupper,
    Typography: Typography,
    IconButton: IButtonWrupper
}

export const listConfig = {
    Button: {
        props: propsButton,
    },
    Typography: {
        props: propsTypography
    },
    IconButton: {
        props: propsIconButton
    }
}
