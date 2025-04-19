import React from 'react';
import Imgix from 'react-imgix';
import { useComponentSize } from './utils/hooks';
import { VerticalCarousel, HorizontalCarousel, PromoBanner } from '../../index';
import Tollbar, { useToolbar } from './utils/Toolbar';
import { Settings } from '@mui/icons-material';


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
                height : height - 8
            }}
        />
    );
});


export const VerticalCarouselWrapper = React.forwardRef((props: any, ref) => {
    const {
        items,
        style = {}, 
        autoplay = true,
        slidesToShow = 3,
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { width, height } = useComponentSize(componentId);
   
    const createImgx = (src: string) => {
        return(
            <Imgix
                data-type="Image"
                src={src ?? 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg'}
                sizes={'100vw'}
                imgixParams={{}}
                htmlAttributes={{
                    width: width,
                    height: (height / slidesToShow)
                }}
            />
        );
    }
    // дегидратор
    const parseItems = () => {
        const result = [];

        items.map((elem, index)=> {
            if(elem.type === 'img') {
                if(elem.props.src) result.push(
                    createImgx(elem.props.src)
                );
            }
        });

        return result;
    }

    return (
        <div
            ref={ref}
            data-type="VerticalCarousel"
            data-id={componentId}
            style={{
                width,
                display: 'block',
                height: '100%',
                overflow: 'hidden',
            }}
            {...otherProps}
        >
            <VerticalCarousel
                items={parseItems() ?? []}
                height={height}
                settings={{
                    autoplay,
                    slidesToShow
                }}
            />
        </div>
    );
});

// todo: сделать умный расчет по умолчанию сколько слайдов выводить
export const HorizontalCarouselWrapper = React.forwardRef((props: any, ref) => {
    const {
        items,
        fullWidth,
        autoplay = true,
        slidesToShow = 3,
        style = {}, 
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { visible, context } = useToolbar(componentId);
    const { width, height } = useComponentSize(componentId);

    const createImgx = (src: string) => {
        return(
            <Imgix
                data-type="Image"
                src={src ?? 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg'}
                sizes={'100vw'}
                imgixParams={{}}
                htmlAttributes={{
                    width: width,
                    height: height
                }}
            />
        );
    }
    // дегидратор
    const parseItems = () => {
        const result = [];

        items.map((elem, index)=> {
            if(elem.type === 'img') {
                if(elem.props.src) result.push(
                    createImgx(elem.props.src)
                );
            }
        });

        return result;
    }
    

    return (
        <div
            ref={ref}
            data-type="HorizontCarousel"
            data-id={componentId}
            style={{
                width,
                display: 'block',
                overflow: 'hidden',
                position: 'relative',
            }}
            {...otherProps}
        >
            <Tollbar 
                visible={visible}
                offsetY={0}
                options={[
                    { icon: <Settings/>,  },
                ]}
            />
            <HorizontalCarousel
                items={parseItems() ?? []}
                height={height-8}
                settings={{
                    autoplay,
                    slidesToShow
                }}
            />
        </div>
    );
});

export const PromoBannerWrapper = React.forwardRef((props: any, ref) => {
    const {
        items,
        fullWidth,
        style = {}, 
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { visible, context } = useToolbar(componentId);
    const { width, height } = useComponentSize(componentId);
    

    return (
        <div
            ref={ref}
            data-type="PromoBanner"
            data-id={componentId}
            style={{
                display: 'block',
                overflow: 'hidden',
                position: 'relative'
            }}
            { ...otherProps }
        >
            <Tollbar 
                visible={visible}
                offsetY={0}
                options={[
                    { icon: <Settings/>,  },
                ]}
            />
            <PromoBanner
                items={items}
                style={style}
            />
        </div>
    );
});