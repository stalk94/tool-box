import { toJSXProps } from './utils';
import { toObjectLiteral, exportTipTapValue } from './utils';


export default function exportedCard(
    id: number | string, 
    style: React.CSSProperties,
    slots: any, 
    heightMedia, 
    srcMedia: string
) {
    const getMediaType =(src: string)=> {
        if (!src) return 'img';
        // Убираем query-параметры
        const cleanSrc = src.split('?')[0];
        const ext = cleanSrc.split('.').pop()?.toLowerCase();
        if (['mp4', 'webm', 'ogg'].includes(ext || '')) return 'video';
        return 'img';
    }
    const render = () => {
        const result = {};

        Object.keys(slots).map((slotName)=> {
            if(slots[slotName]) result[slotName] = exportTipTapValue(slots[slotName]);
            else result[slotName] = `<div dangerouslySetInnerHTML={{__html: <p>${slotName}</p>}}/>`;
        });

        return result;
    }
    const mediaRender = () => {
        const type = getMediaType(srcMedia);
        
        if (type === 'video') {
            return (`
                <CardMedia
                    component="video"
                    src={"${srcMedia}"}
                    height={"${heightMedia}"}
                    controls
                    alt={'video'}
                />
            `);
        }
        else return (`
            <CardMedia
                component="img"
                src={"${srcMedia}"}
                height={"${heightMedia}"}
                alt={'image'}
            />
        `);
    }
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }

    const slotsRender = render();


    return (`
        import React from 'react';
        import { Chip, Box, Rating, Button, Card, CardHeader, CardMedia, CardActions } from '@mui/material';
        import { StarBorder } from '@mui/icons-material';


        export default function CustomCard() {
            return (
                <Card
                    component="div"
                    sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                        borderRadius: '5px',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    style={{ ${toObjectLiteral(style)} }}
                    elevation={8}
                >
                    <CardHeader 
                        avatar={<StarBorder />}
                        title={${slotsRender.title}}
                        subheader={${slotsRender.subheader}}
                        action={
                            <Chip 
                                icon={<StarBorder />} 
                                size="small"                // "small", "medium"
                                label="new" 
                            />
                        }
                    />

                    ${ mediaRender() }

                    <div style={{ marginTop: '3%', marginLeft:8, marginBottom: 'auto', overflow: 'auto' }}>
                        ${slotsRender.text}
                    </div>

                    <CardActions 
                        sx={{ 
                            width: '100%', 
                            mb: 0.5
                        }}
                    >
                        <Box sx={{ p: 1 }}>
                            <Rating 
                                defaultValue={2} 
                                precision={1} 
                                size={'medium'}                     // 'medium', 'small', 'large'
                                max={5}
                                onChange={(e, v)=> {
                                    console.log(v)
                                }}
                            />
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                            <Button 
                                sx={{ m: 0.5 }} 
                                variant='outlined' 
                                size={'medium'}                    // 'medium', 'small', 'large'
                                onClick={()=> {
                                    console.log('click')
                                }}
                            >
                                add to cart
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            );
        }
    `);
}

export function renderImage(src, style, otherProps) {
    return (`
        <img
            src={"${src ?? '/placeholder.jpg'}"}
            style={{ ${toObjectLiteral(style)} }}
            ${ toJSXProps(otherProps) }
        />
    `)
}
export function renderVideo(src, style, otherProps) {
    return (`
        <video
            src={"${src}"}
            style={{ ${toObjectLiteral(style)} }}
            ${ toJSXProps(otherProps) }
        />
    `)
}

