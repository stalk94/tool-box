import React from 'react';
import { JSONContent } from '@tiptap/react';
import { Card, Header, MediaImage } from '@lib/index';
import { iconsList } from '@lib/components/tools/icons';
import { Box, Button, IconButton, Avatar, Chip, Typography, Rating } from '@mui/material';
import TipTapSlotEditor from '../tip-tap';


type TextSlotsName = 'title' | 'subheader' | 'text'; 
export type ButtonSlot = {
    type: 'Button' | 'IconButton'
    text?: string
    icon?: string
    size?: 'mini' | 'small' | 'medium' | 'large'
    action: 'goTo' | 'action'
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
    variant: 'outlined' | 'text' | 'contained'
}
export type BadgeSlot = {
    icon: string | 'none'
    text: string
    color?: "success" | "warning" | "primary" | "secondary" | "error" | "info"
    size?: 'medium' | 'small'
}
export type AvatarSlot = {
    src?: string
    icon?: string
    text?: string
}
export type RatingSlot = {
    type: 'Rating'
    value?: number
    size?: "medium" | "small" | "large"
    max?: number
}
export type InfoSlot = {
    type: 'Text'
    data: any
}
type FabrikFooter = { 
    dataId: number
    config: (RatingSlot|InfoSlot|ButtonSlot)[] 
}
type BaseCardProps = {
    /** свойство важно для динамическго создания карточек */
    index?: number
    dataId: number
    isEditable: boolean
    disableTop?: boolean
    style?: React.CSSProperties
    elevation?: number
    src: string
    heightMedia: string | number
    mediaStyle?: React.CSSProperties
    textSlots: {
        title?: JSONContent
        subheader?: JSONContent
        text?: JSONContent
    }
    footerSlots?: {
        left: []
        right: []
    }
    topSlots?: {
        avatar?: AvatarSlot
        badge?: BadgeSlot
    }
    onChange?: (editData)=> void
}
type ShopCardProps = BaseCardProps & {
    
}

const Badge =({ icon, text, color, size }: BadgeSlot)=> {
    if(!icon && !text) return;
    const Icon = iconsList[icon];

    return(
        <Chip
            icon={icon && <Icon/> }
            size={size ?? 'small'}
            label={text ?? 'test'}
            color={color}
        />
    );
}
// ? провести систематизацию и типизацию эвентов
const FabrikFooterSlot = ({ config, dataId }: FabrikFooter) => {
    if(!config) return;
    const RatingRender =({ size, max, value }: RatingSlot)=> (
        <Rating
            value={value}
            defaultValue={2}
            precision={1}
            size={size ?? 'medium'}
            max={max ?? 5}
            onChange={(e, v) => {
                sharedEmmiter.emit('event', {
                    id: dataId,
                    data: {
                        value: v,
                        type: 'Card-Rating',

                    },
                    type: 'onChange'
                });
            }}
        />
    );
    const InfoRender =({ data }: InfoSlot)=> (
        data
    );

    return (
        <>
           {config.map((elem, i)=> {
                if(elem.type === 'Button') return(
                    <Button key={i}
                        sx={{ mx: 1 }}
                        variant={elem.variant}
                        color={elem.color}
                        size={elem.size ?? 'small'}
                        onClick={() => {
                            sharedEmmiter.emit('event', {
                                id: dataId,
                                data: {
                                    type: 'Card-Button',
                                    action: elem.action
                                },
                                type: 'onClick'
                            });
                        }}
                    >
                        { elem.text }
                    </Button>
                );
                else if(elem.type === 'IconButton') {
                    const Icon = iconsList[elem.icon];

                    return(
                        <IconButton key={i}
                            sx={{ mx: 0.5 }}
                            onClick={() => {
                                sharedEmmiter.emit('event', {
                                    id: dataId,
                                    data: {
                                        type: 'Card-Button',
                                        action: elem.action
                                    },
                                    type: 'onClick'
                                });
                            }}
                        >
                            <Icon />
                        </IconButton>
                    );
                }
                else if(elem.type === 'Rating') return (
                    <React.Fragment key={i}>
                        { RatingRender(elem) }
                    </React.Fragment>
                );
                else return (
                    <React.Fragment key={i}>
                        { InfoRender(elem) }
                    </React.Fragment>
                );
            })}
        </>
    );
}



export const CardBase = React.memo(({ 
    dataId, 
    style, 
    textSlots, 
    footerSlots, 
    topSlots, 
    src, 
    index, 
    heightMedia, 
    onChange, 
    isEditable, 
    mediaStyle,
    disableTop,
    ...props 
}: BaseCardProps) => {
    const [height, setHeight] = React.useState(60);

    const useChangeTextSlot = React.useCallback((slot: TextSlotsName, data: JSONContent) => {
        const newSlotData = { slots: { ...textSlots, [slot]: data } };
        onChange(newSlotData);
    }, [textSlots]);
    const renderTextNode = React.useCallback((type: TextSlotsName, initialInsert?: any)=> {
        return(
            <TipTapSlotEditor
                autoIndex={index}
                value={textSlots[type]}
                onChange={(html) => useChangeTextSlot(type, html)}
                placeholder="Текст"
                className="no-p-margin"
                isEditable={isEditable}
                initialInsert={{
                    text: 'Title',
                    fontSize: '1.5rem',
                    fontFamily: 'Roboto Condensed", Arial, sans-serif',
                    fontWeight: '500',
                    ...initialInsert
                }}
            />
        );
    }, [textSlots, isEditable]);
    const renderFooter = React.useCallback(()=> {
        if(footerSlots) return(
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mb: 0.5 }}>
                <Box sx={{ p: 1 }}>
                    <FabrikFooterSlot
                        config={footerSlots?.left}
                        dataId={dataId}
                    />
                </Box>
                <Box sx={{ ml: 'auto' }}>
                    <FabrikFooterSlot
                        config={footerSlots?.right}
                        dataId={dataId}
                    />
                </Box>
            </Box>
        );
    }, [footerSlots]);
    const renderTop = React.useMemo(()=> {
        let Icon = undefined;
        if(topSlots?.avatar?.icon) Icon = iconsList[topSlots.avatar.icon];

        return({
            avatar: topSlots?.avatar ? (
                <Avatar
                    src={topSlots?.avatar?.src}
                    children={Icon ? <Icon /> : topSlots.avatar.text}
                />
            ) : undefined,
            badge: (
                <Badge
                    {...topSlots?.badge}
                />
            )
        });
    }, [topSlots]);


    return (
        <Card
            style={{ ...style, height: '100%' }}
            footer={renderFooter()}
            {...props}
        >
            {!disableTop &&
                <Header
                    avatar={renderTop.avatar}
                    action={renderTop.badge}
                    title={renderTextNode('title')}
                    subheader={renderTextNode('subheader', {
                        text: 'subheader',
                        fontSize: '0.875rem'
                    })}
                />
            }

            <MediaImage
                src={src}
                sx={{
                    height: heightMedia === 'auto' 
                        ? height 
                        : heightMedia,
                    ...mediaStyle
                }}
            />

            <Box sx={{  
                    pt: 2, 
                    px: 2, 
                    flex: 1, 
                    overflow: 'auto',
                    minHeight: 0 
                }}
            >
                {renderTextNode('text', {
                    text: 'В зависимости от того, что вы хотите построить, представления узлов работают немного по-разному и могут иметь свои очень специфические возможности',
                    fontSize: '0.9rem',
                })}
            </Box>
        </Card>
    );
});

export const CardShop = ({ dataId, index, ...props }: ShopCardProps) => {
    const createConfigFooter = React.useCallback(()=> {
        
    }, []);
    


    return (
        <CardBase
            dataId={dataId}
            disableTop={true}
            {...props}
        />
    );
}
