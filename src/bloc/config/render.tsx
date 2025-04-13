import React from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import { Picture, Source } from 'react-imgix';
import { propsButton, propsIconButton, propsTypography, propsImage } from './props';
import { Settings } from '@mui/icons-material';
import { iconsList } from '../../components/tools/icons';


const IButtonWrapper = React.forwardRef((props: any, ref) => {
    const { icon, children, ...otherProps } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : Settings;

    return (
        <IconButton
            ref={ref}
            data-type="IconButton"
            {...otherProps}
        >
            <Icon />
        </IconButton>
    );
});
const ButtonWrapper = React.forwardRef((props: any, ref) => {
    const { startIcon, endIcon, children, ...otherProps } = props;

    const StartIcon = startIcon && iconsList[startIcon] ? iconsList[startIcon] : null;
    const EndIcon = endIcon && iconsList[endIcon] ? iconsList[endIcon] : null;

    return (
        <Button
            ref={ref}
            data-type="Button"
            variant="outlined"
            startIcon={StartIcon ? <StartIcon /> : undefined}
            endIcon={EndIcon ? <EndIcon /> : undefined}
            {...otherProps}
        >
            {children}
        </Button>
    );
});
const TypographyWrapper = React.forwardRef((props: any, ref) => (
    <Typography ref={ref} data-type="Typography" {...props}>
        {props.children}
    </Typography>
));
const ImageWrapper = React.forwardRef((props: any, ref) => {
    const { src, alt, imgixParams = {}, sizes, ...rest } = props;

    return (
        <Picture>
            <Source
                src={src}
                imgixParams={imgixParams}
                sizes={sizes ?? '100vw'}
            />
            <img
                ref={ref}
                data-type="Image"
                src={src}
                alt={alt}
                style={{
                    maxWidth: '100%',
                    borderRadius: 5,
                    ...rest.style,
                }}
                {...rest}
            />
        </Picture>
    );
});


export const listAllComponents = {
    Button: ButtonWrapper,
    Typography: TypographyWrapper,
    IconButton: IButtonWrapper,
    Image: ImageWrapper
};


export const listConfig = {
    Button: {
        props: propsButton,
    },
    Typography: {
        props: propsTypography,
    },
    IconButton: {
        props: propsIconButton,
    },
    Image: {
        props: propsImage,
    }
}