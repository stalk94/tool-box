import React from 'react';
import { Box, Button, IconButton, ButtonGroup } from '@mui/material';
import { Divider, DividerProps, Chip, ChipProps, Avatar, AvatarProps, Rating, RatingProps, Typography } from '@mui/material';
import { FiberManualRecord, AdjustOutlined, StarBorder } from '@mui/icons-material';
import { iconsList } from '../../../components/tools/icons';
import { Settings } from '@mui/icons-material';
import { fill, empty } from '../../../components/tools/icons-rating';
import { MediaImage, Header } from '../../../components/carts/atomize';
import Card from '../../../components/carts/base';
import List from '../../../components/list/base';
import { toJsx } from './_ssr-helpers';


const Carousel =({ slidesToShow, items, isHorizontal })=> {  
    const size = () => {
        const result = Math.round(100 / (slidesToShow??1));
        return `${result}%`;
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {items.map((item, i) => {
                if ((item.type === 'image' || item.type === 'video') && i < slidesToShow) {
                    const Tag = item.type === 'image' ? 'img' : 'video';

                    return (
                        <Tag key={i}
                            src={item.src}
                            style={{
                                ...item?.style,
                                width: isHorizontal ? size() : '100%',
                                height: isHorizontal ? '100%' : size(),
                                objectFit: 'cover'
                            }}
                        />
                    );
                }
            })}
        </div>
    );
}
const IconGroop = ({ active, count, style }) => {
    const fill = (active: number) => {
        const result = [];
        if (count > 4) count = 4;

        for (let i = 0; i < count; i++) {
            result.push(
                <IconButton
                    key={i}
                >
                    {i === active
                        ? <AdjustOutlined sx={{ fontSize: (style?.size ?? '14px'), color: style?.activeColor ?? '#c11619' }} />
                        : <FiberManualRecord sx={{ fontSize: (style?.size ?? '12px'), color: style?.color }} />
                    }
                </IconButton>
            );
        }

        return result;
    }

    return (
        <ButtonGroup>
            { fill(active) }
        </ButtonGroup>
    );
}
function PromoSlider({ items, button, styles, style, editor, ...props }) {
    const testData = [{
        title: 'Title',
        buttonText: "ПОДРОБНЕЕ",
        description: 'description',
        images: [
            'https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg',
        ],
    }];
    const render = (width, data) => {
        const style = {title: styles?.title, description: styles?.description}
        const normalizeContent =(content)=> {
            if (React.isValidElement(content)) return content;
            if (typeof content === 'string') return <span dangerouslySetInnerHTML={{ __html: content }} />;
            return null;
        }

        return(
        <Box
            sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: 'row',
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: 'column',
                    justifyContent: width < 600 ? 'start' : "center",
                    alignItems: "start",
                    textAlign: "center",
                    p: 2,
                    flexGrow: 1,
                }}
            >
                <Typography
                    color="text.primary"
                    sx={{
                        textAlign: "left",
                        fontSize: "1.2rem" ,
                        fontWeight: 600,
                        wordBreak: "break-word",
                        lineHeight: 1.2,
                        maxWidth: "100%",
                        //...style?.title
                    }}
                    variant='h4'
                >
                    {normalizeContent(data.title)}
                </Typography>
                <Typography component="div"
                    color="text.secondary"
                    sx={{
                        textAlign: "left",
                        mt: 2,
                        fontSize: "0.8rem" 
                    }}
                >
                    {normalizeContent(data.description)}
                </Typography>
                <Button
                    variant='outlined'
                    color='primary'
                    sx={{ mt: 4 }}
                    {...button}
                    children={button?.children ?? 'go to'}
                />

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 10,
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}
                >
                    <IconGroop
                        //style={styles?.dot}
                        active={0}
                        count={(items ?? testData).length}
                    />
                </Box>
            </Box>
        </Box>
        );
    }

    return (
        <Card
            actionAreaEnabled
            sx={{ minHeight: 205 }}
        >
            <React.Fragment>

                <Box
                    sx={{
                        position: "absolute",
                        zIndex: 1,
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        minHeight: 220,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        p: 2,
                    }}
                >
                   
                </Box>

               
            </React.Fragment>
        </Card>
    );
}


export default {
    Button: ({ children, 'data-id': dataId, startIcon, endIcon, style, ...otherProps })=> {
        const StartIcon = startIcon && iconsList[startIcon] ? iconsList[startIcon] : null;
        const EndIcon = endIcon && iconsList[endIcon] ? iconsList[endIcon] : null;

        return(
            <Button
                data-type="Button"
                variant="outlined"
                startIcon={StartIcon ? <StartIcon /> : undefined}
                endIcon={EndIcon ? <EndIcon /> : undefined}
                sx={{ whiteSpace: 'nowrap' }}
                style={style}
                {...otherProps}
            >
                { children }
            </Button>
        );
    },
    IconButton: ({children, 'data-id': dataId, icon, style, ...otherProps})=> {
        const Icon = icon && iconsList[icon] ? iconsList[icon] : Settings;
        
        return(
            <IconButton
                data-type="IconButton"
                aria-label={`button-${icon}`}
                style={style}
                {...otherProps}
            >
                <Icon />
            </IconButton>
        );
    },

    Divider: (props) => {
        const {
            'data-id': dataId,
            'border-style': borderStyle,
            'border-color': borderColor,
            isChildren,
            children,
            fullWidth,
            variant,
            style,
            ...otherProps
        } = props;

        return (
            <Divider
                orientation={fullWidth ? 'horizontal' : 'vertical'}
                variant={variant}
                flexItem={fullWidth}
                sx={{
                    borderStyle,
                    borderColor
                }}
                style={style}
                {...otherProps}
            >
                {isChildren
                    ? <Typography variant='subtitle2'>
                        {children}
                    </Typography>
                    : undefined
                }
            </Divider>
        );
    },
    Avatar: (props) => {
        const {
            'data-source': source, 
            'data-id': dataId, 
            children, 
            src, 
            file, 
            sizes, 
            icon, 
            fullWidth, 
            isArea, 
            style,
            ...otherProps 
        } = props;
        const Icon = icon && iconsList[icon] ? iconsList[icon] : undefined;

        return (
            <div
                data-id={dataId}
                data-type='Avatar'
                style={{
                    ...style,
                    width: fullWidth ? "100%" : "fit-content",
                }}
            >
                <Avatar
                    src={src}
                    sx={{
                        width: sizes,
                        height: sizes
                    }}
                    children={
                        (source === 'children')
                            ? children ? children : 'H'
                            : Icon ? <Icon /> : undefined
                    }
                    {...otherProps}
                />
            </div>
        );
    },
    Rating: (props) => {
        const { 'data-id': dataId, iconName, apiPath, colors='#ff3d47', fullWidth, isHalf, style, ...otherProps } = props;
        const IconFill = (iconName && fill[iconName]) ? iconsList[iconName] : undefined;
        const IconEmpty = (iconName && empty[iconName]) ? empty[iconName] : undefined;

        return (
            <div
                data-id={dataId}
                data-type='Rating'
                style={{
                    ...style,
                    width: fullWidth ? "100%" : "fit-content"
                }}
            >
                <Rating
                    icon={IconFill && <IconFill fontSize="inherit" />}
                    emptyIcon={IconEmpty && <IconEmpty fontSize="inherit" />}
                    precision={isHalf ? 0.5 : 1}
                    sx={{
                        '& .MuiRating-iconFilled': {
                            color: colors,
                        },
                        '& .MuiRating-iconHover': {
                            color: colors,
                        }
                    }}
                    {...otherProps}
                />
            </div>
        );
    },
    Chip: (props) => {
        const { 'data-id': dataId, fullWidth, avatar, label, icon, ...otherProps } = props;
        const Icon = icon && iconsList[icon] ? iconsList[icon] : undefined;

        return (
            <Chip
                component="a"
                icon={Icon ? <Icon /> : undefined}
                label={label}
                {...otherProps}
            />
        );
    },
    List: (props) => {
        const {'data-id': dataId, style, isButton, isSecondary, fullWidth, items} = props;
        const parsedItems = items.map((item, index) => {
            const Icon = (item.startIcon && iconsList[item.startIcon]) ? iconsList[item.startIcon] : null;

            return ({
                startIcon: Icon ? <Icon/> : undefined,
                primary: toJsx(item.primary),
                secondary: isSecondary ? toJsx(item.secondary) : undefined
            });
        });

        return (
            <div
                data-id={dataId}
                data-type='List'
                style={{
                    ...style,
                    width: fullWidth ? "100%" : "fit-content"
                }}
            >
                <List
                    onClick={isButton && console.log}
                    items={parsedItems}
                />
            </div>
        );
    },

    Typography: (props) => {
        const { children, 'data-id': dataId, style, fullWidth, fontFamily, textAlign, ...otherProps } = props;


        return (
            <Typography
                data-id={dataId}
                data-type="Typography"
                {...otherProps}
                sx={{
                    width: '100%',
                    whiteSpace: 'normal',     // перенос строк разрешён
                    wordBreak: 'keep-all',    // слова не разбиваются
                    overflowWrap: 'normal',
                    display: 'block'
                }}
                style={{
                    ...style,
                    fontFamily,
                    textAlign
                }}
            >
                { children }
            </Typography>
        );
    },
    Text: (props) => {
        const { children, 'data-id': dataId, style, fullWidth, ...otherProps } = props;

        return (
            <div
                data-id={dataId}
                data-type="Text"
                style={{ width: '100%', ...style }}
            >
                { toJsx(children) }
            </div>
        );
    },

    Image: (props) => {
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

        return (
            <img
                data-id={dataId}
                data-type="Image"
                src={src ?? '/placeholder.jpg'}
                style={{
                    width: '100%',
                    height: '100%',
                    ...style
                }}
                {...otherProps}
            />
        );
    },
    Video: (props) => {
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

        return (
            <video
                data-id={dataId}
                data-type="Video"
                width={'100%'}
                height={'100%'}
                src={src}
                controls={controls}
                autoPlay={autoplay}
                loop={loop}
                poster={poster}
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    ...style
                }}
                {...otherProps}
            />
        );
    },
    HorizontCarousel: (props) => {
        const { items, fullWidth, 'data-id': dataId, delay, style = {}, slidesToShow, ...otherProps } = props;

        return (
            <Carousel
                isHorizontal={true}
                slidesToShow={items.length > slidesToShow ? slidesToShow : items.length}
                items={items}
                {...otherProps}
            />

        );
    },
    VerticalCarousel: (props) => {
        const { items, fullWidth, 'data-id': dataId, delay, style = {}, slidesToShow, ...otherProps } = props;

        return (
            <Carousel
                slidesToShow={items.length > slidesToShow ? slidesToShow : items.length}
                items={items}
                {...otherProps}
            />

        );
    },
    PromoBanner: (props) => {
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
        function sanitizeStyle(obj: any) {
            if (!obj || typeof obj !== 'object') return obj;
            const result: any = {};
            for (const key in obj) {
                if (typeof obj[key] !== 'function') {
                    result[key] = obj[key];
                }
            }
            return result;
        }
        const createButtonProps = () => {
            const buttonProps = {
                variant: vb,
                color: cb,
                children: chb
            }

            return buttonProps;
        }
        const parsedItems = items.map((item, i) => ({
            images: item.images,
            title: toJsx(item.title),
            description: toJsx(item.description),
        }));
        
        return (
            <div
                data-type="PromoBanner"
                data-id={dataId}
                style={{
                    display: 'block',
                    overflow: 'hidden',
                    position: 'relative',
                  
                }}
            >
                
            </div>
        );
    },
    Card: (props) => {
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

        return (
            <Card
                style={{...style, height: '100%'}}
                elevation={8}
            >
                <Header
                    avatar={<StarBorder />}
                    title={toJsx(slots?.title)}
                    subheader={toJsx(slots?.subheader)}
                    action={
                        <Chip
                            icon={<StarBorder />}
                            size="small"
                            label="new"
                        />
                    }
                />
                <MediaImage
                    sx={{ px: 0.7 }}
                    height={heightMedia}
                    src={src}
                />
                <div style={{
                        marginTop: '3%',
                        marginBottom: 'auto',
                        overflow: 'auto'
                    }}
                >
                    { toJsx(slots?.text) }
                </div>
            </Card>
        );
    },

    Divide: (props) => {


        return (
            1
        );
    },
}