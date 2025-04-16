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

    const f = () => {
        if (!src || src.length === 0) return 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg';
        else return src;
    }
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
            src={f()}
            sizes={sizes}
            imgixParams={imgixParams}
            htmlAttributes={{
                width : width, 
                height : height 
            }}
        />
    );
});