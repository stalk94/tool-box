import React from 'react';
import Imgix from 'react-imgix';


// работаем с адаптивом!
export const ImageWrapper = React.forwardRef((props: any, ref) => {
    const { src,
        alt = '',
        imgixParams = {},
        sizes = '100vw',
        objectFit = 'cover',
        style = {},
        ...otherProps 
    } = props;

    const combinedStyle = {
        width: '100%',
        height: '100%',
        objectFit,
        display: 'block',
        ...style,
    }


    return (
        <Imgix
            ref={ref}
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