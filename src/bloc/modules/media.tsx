import React from 'react';
import { LoaderToolWrapper } from './sources/image-toolbar';
import { useComponentSizeWithSiblings } from './helpers/hooks';
import { CarouselHorizontal, PromoBanner, CarouselVertical, CarouselProps } from '../../index';
import { updateComponentProps } from '../helpers/updateComponentProps';
import { uploadFile } from 'src/app/plugins';
import TipTapSlotEditor from './tip-tap';
import renderCart, { renderImage, renderVideo } from './export/media';
import { exportTipTapValue, toJSXProps, toLiteral, renderComponentSsr } from './export/utils';
import { ComponentProps } from '../type';
import type { ButtonSlot, AvatarSlot, RatingSlot } from './sources/cards';
import { CardBase, CardShop } from './sources/cards';


////////////////////////////////////////////////////////////////////////////
type PromoBannerWrapperProps = ComponentProps & {
    'data-id': number
    fullWidth: boolean
    style?: React.CSSProperties
    items: {
        title: string;
        description: string;
        images: string[];
    }[]
    styles?: {
        dot?: {
            activeColor: string
            color: string
            fontSize: number | string
        }
        title?: React.CSSProperties
        description?: React.CSSProperties
    }
    'variant-button'?: string
    'color-button'?: string 
    'path-button'?: string
    'children-button'?: string
}
type CarouselWrapperProps = ComponentProps & CarouselProps & {
    'data-id': number
    fullWidth: boolean
    'data-type': 'HorizontCarousel' | 'VerticalCarousel'
    style?: React.CSSProperties
    delay?: number
    autoplay?: boolean
}
type ImageWrapperProps = ComponentProps & {
    'data-id': number
    'data-type': 'Image'
    'data-source': 'src' | string
    fullWidth: boolean
    src: string
    alt?: string
    style: React.CSSProperties
}
type VideoWrapperProps = ComponentProps & {
    'data-id': number
    'data-type': 'Video'
    fullWidth: boolean
    src: string
    style: React.CSSProperties
}
type CardWrapperProps = ComponentProps & {
    'data-id': number
    'data-type': 'Card'
    index?: number
    fullWidth: boolean
    style: React.CSSProperties
    elevation?: number
    src: string
    heightMedia: string | number
    'avatar-src': string | undefined
    'avatar-icon': string | undefined
    'avatar-text': string | undefined
    slots: {
        title: string
        subheader: string
        text: string
    }
}
type ShopCardWrapperProps = CardWrapperProps & {
    'data-id': number
    'data-type': 'ShopCard'
}
////////////////////////////////////////////////////////////////////////////


export const ImageWrapper = React.forwardRef((props: ImageWrapperProps, ref) => {
    const [imgSrc, setImgSrc] = React.useState<string>();
    const lastFileRef = React.useRef<number | null>(null);
    const {
        src,
        file,
        isArea,
        'data-id': dataId,
        alt = '',
        'data-source': source,
        fullWidth,
        style = {},
        ...otherProps
    } = props;
    const { width, height } = useComponentSizeWithSiblings(dataId);

    const handleUpload = async (file) => {
        setImgSrc('https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif');
        const filename = `img-${dataId}.${file.name.split('.').pop()}`;
        const url = await uploadFile(file, filename);

       
        setImgSrc(`${url}?v=${Date.now()}`);
        updateComponentProps({ 
            component: { props }, 
            data: { src: `${url}?${Date.now()}` } 
        });
    }
    const exportCode = (call) => {
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
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props, imgSrc]);
    React.useEffect(() => {
        if(!EDITOR) return;

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
            data-id={dataId}
            data-type="Image"
            src={imgSrc ?? '/placeholder.jpg'}
            style={{
                width: '100%',
                height: height ?? '100%',
                ...style
            }}
            {...otherProps}
        />
    );
});
export const VideoWrapper = React.forwardRef((props: VideoWrapperProps, ref) => {
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
    
    const exportCode = (call) => {
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
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props, videoSrc]);
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
        if(!EDITOR) return;

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


export const HorizontalCarouselWrapper = React.forwardRef((props: CarouselWrapperProps, ref) => {
    const [active, setActive] = React.useState(0);
    const { items, fullWidth, 'data-id': dataId, delay, style = {}, slidesToShow, ...otherProps } = props;
    
    const exportCode = (call) => {
        const itemsLitears = items.map((item, index) => {
            if(item.type !== 'content') return ({
                ...item
            });
            else return ({
                ...item,
                src: { __raw: renderComponentSsr(item.src).trim() }
            });
        });

        const code = (`
                import React from 'react';
                import { CarouselHorizontal } from '@lib/index';
    
                export default function CarouselHorizontalWrap() {
                    const items = ${toLiteral(itemsLitears)};

                    return(
                        <div 
                            style={
                                ${toLiteral({
                                    display: 'block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    ...style
                                })}
                            }
                        >
                            <CarouselHorizontal
                                items={items}
                                style={{ }}
                                slidesToShow={${items.length > slidesToShow ? slidesToShow : items.length}}
                                ${toJSXProps(otherProps)}
                            />
                        </div>
                    );
                }
        `);

        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);

    const handleChangeReloadContent = (index: number, data: string | undefined, type?: 'image'|'video') => {
        if (items[index]) {
            const newItems = JSON.parse(JSON.stringify(items));
            
            newItems[index].src = data ? data : '';
            if(type) newItems[index].type = type;

            updateComponentProps({
                component: { props },
                data: { items: newItems },
            });
        }
    }
    const parsedItems = React.useMemo(() => {
        if(EDITOR) return items.map((item, i) => {
            const itemCopy = { ...item };

            if(item.type === 'image' || item.type ==='video') {
                const Tag = item.type === 'image' ? 'img' : 'video';
                
                itemCopy.src = (
                    <LoaderToolWrapper
                        style={{}}
                        name={`hc-${dataId}-${i}`}
                        src={item.src}
                        select={active}
                        index={i}
                        setSelect={setActive}
                        onAdd={(src: string, type)=> handleChangeReloadContent(i, src, type)}
                        onDelete={()=> handleChangeReloadContent(i, undefined)}
                    >
                        <Tag 
                            src={item.src} 
                            style={{ 
                                ...item?.style,
                                width: '100%', 
                                height: '100%',
                                objectFit: 'cover'
                            }} 
                        />
                    </LoaderToolWrapper>
                );
            }

            return itemCopy;
        });
    }, [items, active]);
   
    
    return (
        <div
            ref={ref}
            data-type="HorizontCarousel"
            data-id={dataId}
            style={{
                width: '100%',
                display: 'block',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CarouselHorizontal
                autoplayDelay={delay * 1000}   
                slidesToShow={items.length > slidesToShow ? slidesToShow : items.length}
                items={EDITOR ? parsedItems : items}
                editor={EDITOR}
                { ...otherProps }
            />
        </div>
    );
});
export const VerticalCarouselWrapper = React.forwardRef((props: CarouselWrapperProps, ref) => {
    const [active, setActive] = React.useState(0);
    const { 'data-id': dataId, fullWidth, delay, items, ...otherProps } = props;
    const { width, height } = useComponentSizeWithSiblings(dataId);
    

    const exportCode = (call) => {
        const itemsLitears = items.map((item, index) => {
            if(item.type !== 'content') return ({
                ...item
            });
            else return ({
                ...item,
                src: { __raw: renderComponentSsr(item.src).trim() }
            });
        });

        const code = (`
                import React from 'react';
                import { CarouselVertical } from '@lib/index';
    
                export default function CarouselVerticalWrap() {
                    const items = ${toLiteral(itemsLitears)};

                    return(
                        <div 
                            style={
                                ${toLiteral({
                                    display: 'block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    height: height
                                })}
                            }
                        >
                            <CarouselVertical
                                items={items}
                                style={{ }}
                                height={${height}}
                                ${toJSXProps(otherProps)}
                            />
                        </div>
                    );
                }
        `);

        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);
    const handleChangeReloadContent = (index: number, data: string | undefined, type?: 'image'|'video') => {
        if (items[index]) {
            const newItems = JSON.parse(JSON.stringify(items));
            newItems[index].src = data ? data : '';
            if(type) newItems[index].type = type;
;
            updateComponentProps({
                component: { props },
                data: { items: newItems },
            });
        }
    }
    const parsedItems = React.useMemo(() => {
        const styles = {
            img: {
                width: '100%',
                paddingTop: 4,
                paddingBottom: 4,
                height: height / otherProps.slidesToShow,
            },
            video: {
                objectFit: 'cover',
                width: '100%',
                height: height / otherProps.slidesToShow,
                margin: 'auto',
                paddingTop: 4,
                paddingBottom: 4,
            }
        }

        return items.map((item, i) => {
            const itemCopy = { ...item };

            if(item.type === 'image' || item.type ==='video') {
                const Tag = item.type === 'image' ? 'img' : 'video';
                
                itemCopy.src = (
                    <LoaderToolWrapper
                        style={{}}
                        name={`vc-${dataId}-${i}`}
                        src={item.src}
                        select={active}
                        index={i}
                        setSelect={setActive}
                        onAdd={(src: string, type)=> handleChangeReloadContent(i, src, type)}
                        onDelete={()=> handleChangeReloadContent(i, undefined)}
                    >
                        <Tag 
                            src={item.src} 
                            style={styles[Tag]} 
                        />
                    </LoaderToolWrapper>
                );
            }

            return itemCopy;
        });
    }, [items, active, height, otherProps.slidesToShow]);

    
    return(
        <div
            ref={ref}
            data-id={dataId}
            data-type="VerticalCarousel"
            style={{
                height: height,
                width: '100%',
                display: 'block',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CarouselVertical
                autoplayDelay={delay * 1000}
                items={EDITOR ? parsedItems : items}
                editor={EDITOR}
                { ...otherProps }
            />
        </div>
    );
});


export const PromoBannerWrapper = React.forwardRef((props: PromoBannerWrapperProps, ref) => {
    const [active, setActive] = React.useState(0);
    const [activeSlide, setActiveSlide] = React.useState(0);
    const {
        items, 
        fullWidth, 
        style = {}, 
        'data-id': dataId, 
        'variant-button': vb, 
        'color-button': cb, 
        'path-button': pb, 
        'children-button': chb, 
        ...otherProps
    } = props;
    const { width, height } = useComponentSizeWithSiblings(dataId);


    const exportCode = (call) => {
        const itemsLitears = items.map((item, index) => {
            return ({
                images: item.images,
                title: { __raw: `(${exportTipTapValue(item.title).trim()})` },
                description: { __raw: `(${exportTipTapValue(item.description).trim()})` }
            });
        });

        const code = (`
                import React from 'react';
                import { PromoBanner } from '@lib/index';
    
                export default function PromoBannerWrap() {
                    const items = ${toLiteral(itemsLitears)};

                    return(
                        <div 
                            style={
                                ${toLiteral({
                                    display: 'block',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    width: '100%',
                                    ...style
                                })}
                            }
                        >
                            <PromoBanner
                                items={items}
                                actionAreaEnabled={true}
                                style={{ height: ${height}, width: '100%' }}
                                button={ ${toLiteral(createButtonProps())} }
                                ${toJSXProps(otherProps)}
                            />
                        </div>
                    );
                }
        `);

        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);
    const handleChangeEdit = (index: number, data: any) => {
        if (items[index]) {
            const newItems = [...items];
            newItems[index] = data;

            updateComponentProps({
                component: { props },
                data: { items: newItems },
            });
        }
    }
    const textEditable = (key: 'title' | 'description', value: string, index: number) => {
        return (
            <TipTapSlotEditor
                autoIndex={index}
                value={value}
                onChange={(html) => {
                    const copy = { ...items[index] };
                    copy[key] = html;
                    handleChangeEdit(index, copy)
                }}
                placeholder="Текст"
                className="no-p-margin"
                isEditable={EDITOR}
                initialInsert={{
                    text: '',
                }}
            />
        )
    }
    const handleChangeReloadContent = (active: number, data: string | undefined) => {
        if (items[active]) {
            const newItems = JSON.parse(JSON.stringify(items));
            newItems[active].images[0] = data ? data : '';

            updateComponentProps({
                component: { props },
                data: { items: newItems },
            });
        }
    }
    const createImageWrapper =(src: string, i: number)=> {
        return(
            <LoaderToolWrapper
                isDelCentre={true}
                name={`pb-${dataId}-${i}`}
                src={src}
                select={activeSlide}
                index={i}
                setSelect={setActiveSlide}
                onAdd={(src: string, type) => handleChangeReloadContent(i, src)}
                onDelete={() => handleChangeReloadContent(i, undefined)}
            >
                <div style={{height: 120}}/>
            </LoaderToolWrapper>
        );
    }
    const createButtonProps =()=> {
        const buttonProps = {
            variant: vb,
            color: cb,
            children: chb
        }

        if(pb && pb.length > 3) buttonProps.onClick =()=> console.log(pb);
        return buttonProps;
    }
    const parsedItems = React.useMemo(() => {
        return items.map((item, i) => {
            if (i === active) {
                return {
                    images: [...item.images],
                    title: textEditable('title', item.title, i),
                    description: textEditable('description', item.description, i),
                };
            }
            return item;
        });
    }, [items, active]);
    
    
    return (
        <div
            ref={ref}
            data-type="PromoBanner"
            data-id={dataId}
            style={{
                display: 'block',
                overflow: 'hidden',
                position: 'relative',
                ...style
            }}
        >
            <PromoBanner
                editor={EDITOR && createImageWrapper(parsedItems[active].images[activeSlide], active)}
                onChange={setActive}
                items={parsedItems}
                style={{...style, height, width}}
                styles={{...otherProps?.styles}}
                button={createButtonProps()}
                actionAreaEnabled={otherProps?.actionAreaEnabled}
            />
        </div>
    );
});
export const CardWrapper = React.forwardRef((props: CardWrapperProps, ref) => {
    const [imgSrc, setImgSrc] = React.useState<string>();
    const lastFileRef = React.useRef<number | null>(null);
    const {
        'data-id': dataId,
        fullHeight,
        style = {}, 
        elevation = 1,
        slots,
        file,
        src,
        index = 0,
        heightMedia,
        'avatar-src': avatarSrc,
        'avatar-icon': avatarIcon,
        'avatar-text': avatarText,
    } = props;
    const { width, height } = useComponentSizeWithSiblings(dataId);

    const handleUpload = async (file) => {
        setImgSrc('https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif');
        const filename = `img-${dataId}.${file.name.split('.').pop()}`;
        const url = await uploadFile(file, filename);


        setImgSrc(`${url}?v=${Date.now()}`);
        updateComponentProps({
            component: { props },
            data: { src: `${url}?${Date.now()}` }
        });
    }
    const exportCode = (call) => {
        const code = renderCart(
            dataId,
            {...style, height: fullHeight && '100%'}, 
            slots, 
            heightMedia, 
            imgSrc
        );

        call(code);
    }
    const onChange = React.useCallback((data) => {
        updateComponentProps({
            component: { props: props },
            data
        });
    }, [props]);

    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
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
            data-id={dataId}
            style={{
                maxHeight: height
            }}
        >
            <CardBase
                dataId={dataId}
                elevation={elevation}
                isEditable={EDITOR}
                index={index}
                textSlots={slots}
                src={imgSrc}
                heightMedia={heightMedia}
                onChange={onChange}
                topSlots={{
                    avatar: {
                        src: avatarSrc,
                        icon: avatarIcon,
                        text: avatarText
                    }
                }}
                footerSlots={{
                    left: [],
                    right: [{
                        type: 'Button',
                        action: 'goTo',
                        variant: 'outlined',
                        text: 'go to'
                    } as ButtonSlot]
                }}
                style={{
                    ...style,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            />
        </div>
    );
});
export const ShopCardWrapper = React.forwardRef((props: CardWrapperProps, ref) => {
    const [imgSrc, setImgSrc] = React.useState<string>();
    const lastFileRef = React.useRef<number | null>(null);
    const {
        'data-id': dataId,
        fullHeight,
        style = {}, 
        elevation = 1,
        slots,
        file,
        src,
        index = 0,
        heightMedia,
        'avatar-src': avatarSrc,
        'avatar-icon': avatarIcon,
        'avatar-text': avatarText,
    } = props;
    const { width, height } = useComponentSizeWithSiblings(dataId);

    const handleUpload = async (file) => {
        setImgSrc('https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif');
        const filename = `img-${dataId}.${file.name.split('.').pop()}`;
        const url = await uploadFile(file, filename);


        setImgSrc(`${url}?v=${Date.now()}`);
        updateComponentProps({
            component: { props },
            data: { src: `${url}?${Date.now()}` }
        });
    }
    const exportCode = (call) => {
        const code = renderCart(
            dataId,
            {...style, height: fullHeight && '100%'}, 
            slots, 
            heightMedia, 
            imgSrc
        );

        call(code);
    }
    const onChange = React.useCallback((data) => {
        updateComponentProps({
            component: { props: props },
            data
        });
    }, [props]);

    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
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
            data-type="ShopCard"
            data-id={dataId}
            style={{
                maxHeight: height
            }}
        >
            <CardShop
                dataId={dataId}
                elevation={elevation}
                isEditable={EDITOR}
                index={index}
                textSlots={slots}
                src={imgSrc}
                heightMedia={heightMedia}
                onChange={onChange}
                footerSlots={{
                    left: [],
                    right: [{
                        type: 'Button'
                    }]
                }}
                style={{
                    ...style,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            />
        </div>
    );
});