import React from 'react';
import Imgix from 'react-imgix';
import { useComponentSizeWithSiblings } from './utils/hooks';
import { VerticalCarousel, HorizontalCarousel, PromoBanner } from '../../index';
import Tollbar, { useToolbar } from './utils/Toolbar';
import { Settings } from '@mui/icons-material';
import { updateComponentProps } from '../utils/updateComponentProps';
import { uploadFile } from 'src/app/plugins';


export const ImageWrapper = React.forwardRef((props: any, ref) => {
    const [imgSrc, setImgSrc] = React.useState<string>();
    const [sourceType, setSource] = React.useState<string>();
    const lastFileRef = React.useRef<number | null>(null);
    const {
        src,
        file,
        alt = '',
        imgixParams = {},
        'data-source': source,
        sizes = '100vw',
        objectFit = 'cover',
        style = {},
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { width, height } = useComponentSizeWithSiblings(componentId);
    

    const handleUpload = async (file) => {
        setImgSrc('https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif');
        const filename = `img-${componentId}.${file.name.split('.').pop()}`;
        const url = await uploadFile(file, filename);

       
        setImgSrc(`${url}?v=${Date.now()}`);
        updateComponentProps({ 
            component: { props }, 
            data: { src: `${url}?${Date.now()}` } 
        });
    }
    React.useEffect(() => {
        if (file instanceof File) {
            const id = file.lastModified;
            
            if (id !== lastFileRef.current) {
                lastFileRef.current = id;
                handleUpload(file);
            }
        }
    }, [file]);
    React.useEffect(() => {
        if (!src || src.length === 0){
            setImgSrc('/placeholder.jpg');
        }
        else setImgSrc(src);
        setSource('src');
    }, [src]);


    return (
        <img
            ref={ref}
            data-id={componentId}
            data-type="Image"
            data-source={sourceType}
            src={imgSrc ?? '/placeholder.jpg'}
            style={{
                width: width,
                height: height - 1,
            }}
            {...otherProps}
        />
    );
});
export const VideoWrapper = React.forwardRef((props: any, ref) => {
    const [sourceType, setSource] = React.useState<string>();
    const [videoSrc, setVideoSrc] = React.useState<string>();
    const lastFileRef = React.useRef<number | null>(null);
    const { 
        src, 
        file,
        autoplay = false,
        controls = true,
        loop = false,
        fullWidth,
        poster,
        style = {}, 
        'data-id': dataId,
        ...otherProps 
    } = props;

    const { width, height } = useComponentSizeWithSiblings(dataId);
    
   
    const handleUpload = async (file: File) => {
        setVideoSrc('https://i.gifer.com/YCZH.gif'); // временная заглушка

        try {
            const filename = `video-${dataId}.${file.name.split('.').pop()}`;
            const url = await uploadFile(file, filename);

            const finalUrl = `${url}?v=${Date.now()}`;
            setVideoSrc(finalUrl);

            // Сохраняем src в пропсы компонента через редактор
            updateComponentProps({
                component: { props },
                data: { src: finalUrl }
            });
        } 
        catch (err) {
            console.error('📛 Ошибка загрузки видео:', err);
        }
    }
    React.useEffect(() => {
        if (file instanceof File) {
            const id = file.lastModified;
            
            if (id !== lastFileRef.current) {
                lastFileRef.current = id;
                handleUpload(file);
            }
        }
    }, [file]);
    React.useEffect(() => {
        if (!src || src.length === 0){
            setVideoSrc('');
        }
        else setVideoSrc(src);
        setSource('src');
    }, [src]);


    return (
        <video
            ref={ref}
            data-id={dataId}
            data-type="Video"
            data-source={sourceType}
            width={width}
            height={height-8}
            src={videoSrc}
            controls={controls}
            autoPlay={autoplay}
            loop={loop}
            poster={poster}
            style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                maxHeight: height - 8,
                objectFit: 'contain',
                ...style
            }}
            {...otherProps}
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
    const { width, height } = useComponentSizeWithSiblings(componentId);
    
   
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
    const { width, height } = useComponentSizeWithSiblings(componentId);
    

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
    const { width, height } = useComponentSizeWithSiblings(componentId);
    console.log(width, height)

    return (
        <div
            ref={ref}
            data-type="PromoBanner"
            data-id={componentId}
            style={{
                display: 'block',
                overflow: 'hidden',
                position: 'relative',
                height: height - 8
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
                style={{...style, height, width}}
            />
        </div>
    );
});