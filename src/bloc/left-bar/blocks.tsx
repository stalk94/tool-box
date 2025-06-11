import React from "react";
import { Box, Typography, Divider, Chip } from "@mui/material";
import { LayoutCustom, ComponentSerrialize, BlockData, BlockCategory as BlockCategoryVariant } from '../type';
import { DraggableToolItem } from '../Dragable';
import { db } from "../helpers/export";

//db.set(`BLOCK.favorite`, []);




const BlockCategory = React.memo(({ category }: { category: BlockCategoryVariant })=> {
    const [render, setRender] = React.useState<BlockData[]>([]);

    const wrapper =(html: string)=> {
        return(
            <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
                <div
                    style={{
                        transform: 'scale(0.5)',
                        transformOrigin: 'top left',
                        height: `${100 / 0.3}%`, // ← Ключ: компенсируем масштаб
                        width: `${100 / 0.5}%`,  // ← Аналогично по ширине
                        pointerEvents: 'none',
                    }}
                    dangerouslySetInnerHTML={{__html:  html}}
                />
            </div>
        );
    }
    React.useEffect(() => {
        (async () => {
            const value = await db.get(`BLOCK.${category}`);
            if(value) setRender(value);
        })();
    }, [category]);
    

    return (
        <>
            {render.map((block, index) => 
                <Box key={index} >
                    <DraggableToolItem
                        id={index}
                        data={block}
                        type='block'
                        element={
                            <div
                                key={index}
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: 100,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    border: '1px solid #cbc8c85d',
                                    marginBottom: 5,
                                    background: '#0808081d',
                                    boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.4)'
                                }}
                            >
                                <div style={{
                                        position: 'absolute',
                                        zIndex: 4,
                                        fontSize: 11,
                                        bottom: 0,
                                        right: 0,
                                        padding: '2px 12px', 
                                        border: '1px solid #cbc8c882',
                                        background: '#08080821',
                                        borderRadius: 8,
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    { block.meta.name }
                                </div>
                                {block.meta.preview
                                    ?  wrapper(block.meta.preview)
                                    : <img
                                            src={'/default-block.png'}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                margin: 'auto'
                                            }}
                                        />
                                }
                            </div>
                        }
                    />
                </Box>
            )}
        </>
    );
});


export default BlockCategory;