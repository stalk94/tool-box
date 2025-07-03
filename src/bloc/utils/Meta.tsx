import React from "react";
import { IconButton, Divider, Typography } from '@mui/material';
import MiniRender from "../nest-slot/MiniRender";
import { Settings } from '@mui/icons-material';
import { editorContext, infoSlice, cellsSlice } from "../context";


const RenderButton = ({ type }) => (
    <div style={{ position: 'absolute', zIndex: 999, left: 0, top: 0 }}>
        <IconButton
            sx={{
                backdropFilter: 'blur(4px)',
                padding: '3px',
                color: 'silver',
                '&:hover': {
                    color: 'rgba(237, 64, 37, 0.773)'
                }
            }}
            onClick={() => {
                EVENT.emit('blockSettings', {type: type});
            }}
            children={<Settings />}
        />
    </div>
);


//! сделать отключение в режиме вне редактора, рендера вспомогательных
export function MetaHeader({ width, scope }) {
    const mod = editorContext.mod.use();
    if(scope === 'system') return;

    const { headerLayouts, height } = React.useMemo(()=> {
        const proj = infoSlice.project.get();
        const header = proj.system.find((d) => d.name === 'header');
        
        return { 
            headerLayouts: header.data, 
            height: header.data.size.height
        }
    }, []);


    return(
        <div 
            className='headerEditor' 
            style={{opacity: mod==='grid' ? 0.3 : 1}}
        >
            <MiniRender
                type='Frame'
                layouts={headerLayouts}
                size={{
                    width: width,
                    height: height
                }}
                anyRender={
                    <RenderButton type='header' />
                }
            />
        </div>
    );
}
export function MetaFooter({ width, scope }) {
    const mod = editorContext.mod.use();
    if(scope === 'system') return;

    const { footerLayouts, height } = React.useMemo(()=> {
        const proj = infoSlice.project.get();
        const footer = proj.system.find((d) => d.name === 'footer');
        
        return { footerLayouts: footer.data, height: footer.data.size.height};
    }, []);

    return(
        <>
            <Divider 
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': { flex: 1 },
                    '&::after': { flex: 0 },
                    //borderStyle: 'dashed'
                }}

                children={
                    <Typography textAlign="left" variant='caption'>
                        footer
                    </Typography>
                }
            />
             <div 
                className='footerEditor' 
                style={{opacity: mod==='grid' ? 0.3 : 1}}
            >
                <MiniRender
                    type='Frame'
                    layouts={footerLayouts}
                    size={{
                        width: width,
                        height: height
                    }}
                    anyRender={
                        <RenderButton type='footer' />
                    }
                />
            </div>
        </>
    );
}