import React from 'react'
import { Avatar, CardContent, CardActionArea, CardActions, CardHeader, CardMedia, CardMediaProps } from '@mui/material';
import { alpha, darken, lighten, styled, useTheme } from '@mui/system';


type HeaderProps = {
    /** левая область */
    avatar: any
    /** основной текст */
    title: any
    /** дополнительный текст */
    subheader: any
    /** правая область с действиями, к примеру закрыть, редактировать и прочее */
    action: any
    /** можно немного изменить цвет фона header передав одно из этих свойств */
    bcg?: 'dark' | 'light' | 'alpha'
}
type MediaImageProps = CardMediaProps & {
    src: string
    height?: string|number 
    width?: string|number
}
function getMediaType(src: string): 'img' | 'video' {
    if (!src) return 'img';
    // Убираем query-параметры
    const cleanSrc = src.split('?')[0];
    const ext = cleanSrc.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(ext || '')) return 'video';
    return 'img';
}


/**
 * Элемент картинки для карточки
 * 
 */
export const MediaImage = ({ src, height, width, ...props }: MediaImageProps) => {
    const type = getMediaType(src);
    const useAlt =(src?: string)=> {
        try {
            const match = src?.match(/\/([^\/]+\.[a-zA-Z0-9]+)$/);
            return match?.[1] ?? "image";
        }
        catch {
            return "image";
        }
    }
    
    if (type === 'video') {
        return (
            <CardMedia
                component="video"
                src={src}
                height={height}
                width={width}
                controls
                {...props}
            />
        );
    }
    return (
        <CardMedia
            component="img"
            image={src ?? "https://png.pngtree.com/thumb_back/fh260/background/20240801/pngtree-new-cb-background-images-photos-pics-wallpaper-pictures-image_16123145.jpg"}
            width={width}
            alt={useAlt()}
            {...props}
        />
    );
}
/**
 * Произвольный контент для карточки с flex позиционированием
 */
export const FlexContent = ({ children, flexDirection }: { children:React.ReactNode, flexDirection?: 'row'|'column' }) => {
    return(
        <CardContent sx={{ 
                display: 'flex', 
                flexDirection: flexDirection ?? 'column' 
            }}
        >
            { children }
        </CardContent>
    );
}
/**
 * Шапка карточки
 */
export const Header =({ avatar, title, subheader, action, bcg }: HeaderProps)=> {
    const theme = useTheme();
   
    const getColor =()=> {
        if(bcg === 'dark') return {
            bgcolor: darken(theme.palette.background.paper, 0.1)
        }
        else if(bcg === 'light') return {
            bgcolor: lighten(theme.palette.background.paper, 0.1)    
        }
        else if(bcg === 'alpha') return {
            bgcolor: alpha(theme.palette.background.paper, 0.1)
        }
        //else return {};
    }

    return(
        <CardHeader 
            sx={{
                ...getColor(), 
            }}
            avatar={avatar}
            title={title}
            subheader={subheader}
            action={action}
        />
    );
}
