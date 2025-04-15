import React, {useState, useEffect} from 'react';
import Imgix from 'react-imgix';
import { useComponentSize } from './utils/hooks';


// ! надо еше разбиратся
export const ImageWrapper = React.forwardRef((props: any, ref) => {
    const {
        src,
        alt = '',
        imgixParams = {},
        sizes = '100vw',
        objectFit = 'cover',
        style = {},
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { width, height } = useComponentSize(componentId);

    const combinedStyle = {
        width,
        //height: height-8,
        objectFit,
        display: 'block',
        ...style,
    };


    return (
        <Imgix
            //ref={ref}
            data-id={componentId}
            data-type="Image"
            src={src}
            sizes={sizes}
            imgixParams={imgixParams}
            htmlAttributes={{
                alt,
                style: combinedStyle,
                ...otherProps
            }}
        />
    );
});