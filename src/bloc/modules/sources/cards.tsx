import React from 'react';
import { JSONContent } from '@tiptap/react';
import { Card, Header, MediaImage } from '@lib/index';
import { uploadFile } from 'src/app/plugins';
import { iconsList } from '@lib/components/tools/icons';
import { Box, Button, IconButton, Avatar, Chip, Typography, Rating } from '@mui/material';
import TipTapSlotEditor from '../tip-tap';



type TextSlotsName = 'title' | 'subheader' | 'text'; 
type ButtonSlot = {
    type: 'Button' | 'IconButton'
    text?: string
    icon?: string
    action: 'goTo' | 'action'
    color: string
    variant: 'outlined' | 'text' | 'contained'
}
type BadgeSlot = {
    icon: string | 'none'
    text: string
    color?: "success" | "warning" | "primary" | "secondary" | "error" | "info"
    size?: 'medium' | 'small'
}
type AvatarSlot = {
    src?: string
    icon?: string
    text?: string
}
type RatingSlot = {
    type: 'Rating'
    size?: "medium" | "small" | "large"
    max?: number
}
type InfoSlot = {
    type: 'Text'
    data: any
}
type FabrikFooter = { 
    dataId: number
    config: (RatingSlot|InfoSlot|ButtonSlot)[] 
}
type BaseCardProps = {
    isEditable: boolean
    index?: number
    style?: React.CSSProperties
    elevation?: number
    src: string
    heightMedia: string | number
    textSlots: {
        title?: JSONContent
        subheader?: JSONContent
        text?: JSONContent
    }
    footerSlots?: {
        left: []
        right: []
    }
    topSlots: {
        avatar?: AvatarSlot
        badge?: BadgeSlot
    }
    onChange?: (editData)=> void
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
const FabrikFooterSlot = ({ config, dataId }: FabrikFooter) => {
    const RatingRender =({ size, max }: RatingSlot)=> (
        <Rating
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
                        sx={{ m: 0.5 }}
                        variant={elem.variant}
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
                            sx={{ m: 0.5 }}
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

// ? доделать фабрику footer
export const CardBase = ({ style, textSlots, footerSlots, topSlots, src, index, heightMedia, onChange, isEditable, ...props }: BaseCardProps) => {
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
        return(
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mb: 0.5 }}>
                <Box sx={{ p: 1 }}>

                </Box>
                <Box sx={{ ml: 'auto' }}>

                </Box>
            </Box>
        );
    }, []);
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
            <Header
                avatar={renderTop.avatar}
                action={renderTop.badge}
                title={renderTextNode('title')}
                subheader={renderTextNode('subheader', {
                    text: 'subheader',
                    fontSize: '0.875rem'
                })}
            />

            <MediaImage
                src={src}
                sx={{
                    px: 0.7,
                    height: heightMedia === 'auto' 
                        ? height 
                        : heightMedia
                }}
            />

            <Box sx={{ py: 1, px: 2, flex: 1, overflow: 'auto', minHeight: 0 }}>
                {renderTextNode('text', {
                    text: 'В зависимости от того, что вы хотите построить, представления узлов работают немного по-разному и могут иметь свои очень специфические возможности',
                    fontSize: '0.9rem',
                })}
            </Box>
        </Card>
    );
}