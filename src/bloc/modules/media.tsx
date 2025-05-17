import React from 'react';
import { JSONContent } from '@tiptap/react';
import Imgix from 'react-imgix';
import { useComponentSizeWithSiblings } from './utils/hooks';
import { HorizontalCarousel, PromoBanner, Card, Header, MediaImage } from '../../index';
import Tollbar, { useToolbar } from './utils/Toolbar';
import { StarBorder, Settings } from '@mui/icons-material';
import { updateComponentProps } from '../utils/updateComponentProps';
import { uploadFile } from 'src/app/plugins';
import { Box, Button, CardContent, Chip, Typography, Rating } from '@mui/material';
import TipTapSlotEditor from './tip-tap';
import renderCart, { renderImage, renderVideo } from './export/BaseCard';

type ImageWrapperProps = HTMLImageElement & {
    'data-id': number
    'data-type': 'Image'
    'data-source': 'src' | string
    fullWidth: boolean
    src: string
    alt?: string
    style: React.CSSProperties
}
type VideoWrapperProps = HTMLVideoElement & {
    'data-id': number
    'data-type': 'Video'
    fullWidth: boolean
    src: string
    style: React.CSSProperties
}
type CardWrapperProps = {
    'data-id': number
    'data-type': 'Card'
    index?: number
    fullWidth: boolean
    fullHeight: boolean
    style: React.CSSProperties
    elevation?: number
    src: string
    heightMedia: string | number
    // ??
    slots: {
        title?: JSONContent
        subheader?: JSONContent
        text?: JSONContent
    }
    path: string
    max?: number
    size?: "small" | "medium" | "large"
}


export const ImageWrapper = React.forwardRef((props: ImageWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const [imgSrc, setImgSrc] = React.useState<string>();
    const lastFileRef = React.useRef<number | null>(null);
    const {
        src,
        file,
        alt = '',
        'data-source': source,
        fullWidth,
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
    degidratationRef.current = (call) => {
        const code = renderImage(
            imgSrc, 
            {
                width: '100%',
                height: height - 1,
                ...style
            },
            otherProps
        );
        
        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + componentId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + componentId, handler);
        }
    }, []);
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
    }, [src]);
    

    return (
        <img
            ref={ref}
            data-id={componentId}
            data-type="Image"
            src={imgSrc ?? '/placeholder.jpg'}
            style={{
                width: '100%',
                height: height - 1,
                ...style
            }}
            {...otherProps}
        />
    );
});
export const VideoWrapper = React.forwardRef((props: VideoWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
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
    
    degidratationRef.current = (call) => {
        const code = renderVideo(
            videoSrc,
            {
                display: 'block',
                width: '100%',
                height: 'auto',
                maxHeight: height - 1,
                objectFit: 'contain',
                ...style
            },
            {
                controls,
                autoplay,
                loop,
                ...otherProps
            }
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);
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
    }, [src]);


    return (
        <video
            ref={ref}
            data-id={dataId}
            data-type="Video"
            width={width}
            height={height-1}
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
            <PromoBanner
                items={items}
                style={{...style, height, width}}
            />
        </div>
    );
});
export const CardWrapper = React.forwardRef((props: CardWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const lastFileRef = React.useRef<number | null>(null);
    const {
        fullHeight,
        style = {display:'flex',flexDirection: 'column'}, 
        elevation = 1,
        slots,
        file,
        src,
        index = 0,
        heightMedia,
        ...otherProps
    } = props;

    const [imgSrc, setImgSrc] = React.useState<string>();
    const componentId = props['data-id'];
    //const { width, height } = useComponentSizeWithSiblings(componentId);

    const onChange = (slot, data) => {
        updateComponentProps({
            component: { props: props },
            data: { slots: { ...slots, [slot]: data } }
        });
    }
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
    // в JSX строку
    degidratationRef.current = (call) => {
        const code = renderCart(
            componentId,
            {...style, height: fullHeight && '100%'}, 
            slots, 
            heightMedia, 
            imgSrc
        );

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + componentId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + componentId, handler);
        }
    }, []);
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
        if (!src || src.length === 0) {
            setImgSrc('/placeholder.jpg');
        }
        else setImgSrc(src);
    }, [src]);
    
    
    return (
        <div
            ref={ref}
            data-type="Card"
            data-id={componentId}
            { ...otherProps }
        >
            <Card
                style={{...style, height: '100%'}}
                elevation={8}
                footer={
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mb: 0.5 }}>
                        <Box sx={{ p: 1 }}>
                            <Rating
                                defaultValue={2}
                                precision={1}
                                size={props.size ?? 'medium'}
                                max={props.max ?? 5}
                                onChange={(e, v) => {
                                    fetch('/api/component/card', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ rating: v, path: props.path })
                                    })
                                }}
                            />
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                            <Button
                                sx={{ m: 0.5 }}
                                variant='outlined'
                                size={props?.size}
                                onClick={() => {
                                    fetch('/api/component/card', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ addCart: props.index, path: props.path })
                                    })
                                }}
                            >
                                add to cart
                            </Button>
                        </Box>
                    </Box>
                }
            >
                <Header
                    avatar={ <StarBorder/> }
                    title={
                        <TipTapSlotEditor
                            autoIndex={index}
                            value={slots?.title}
                            onChange={(html) => onChange('title', html)}
                            placeholder="Текст"
                            className="no-p-margin"
                            isEditable={EDITOR}
                            initialInsert={{
                                text: 'Title',
                                fontSize: '1.5rem',
                                fontFamily: 'Roboto Condensed", Arial, sans-serif',
                                fontWeight: '500',
                            }}
                        />
                    }
                    subheader={
                        <TipTapSlotEditor
                            autoIndex={index}
                            value={slots?.subheader}
                            onChange={(html) => onChange('subheader', html)}
                            placeholder="Текст"
                            className="no-p-margin"
                            isEditable={EDITOR}
                            initialInsert={{
                                text: 'subheader',
                                fontSize: '0.875rem',
                                fontFamily: 'Roboto Condensed", Arial, sans-serif',
                                fontWeight: '500',
                            }}
                        />
                    }
                    action={
                        <Chip
                            icon={<StarBorder/>}
                            size="small"
                            label="new" 
                        />
                    }
                />
                
                <MediaImage
                    sx={{ px: 0.7 }}
                    height={heightMedia}
                    src={imgSrc}
                />
                <div style={{
                        marginTop: '3%',
                        marginBottom: 'auto',
                        overflow: 'auto'
                    }}
                >
                    <TipTapSlotEditor
                        autoIndex={index}
                        value={ slots?.text }
                        onChange={(html) => onChange('text', html)}
                        placeholder="Текст"
                        className="no-p-margin p"
                        isEditable={EDITOR}
                        initialInsert={{
                            text: 'В зависимости от того, что вы хотите построить, представления узлов работают немного по-разному и могут иметь свои очень специфические возможности',
                            fontSize: '0.975rem',
                            fontFamily: 'Roboto Condensed", Arial, sans-serif',
                        }}
                    />
                </div>
            </Card>
        </div>
    );
});