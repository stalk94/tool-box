import React, { useState } from 'react';
import { Paper, IconButton, Box, Typography, Button } from '@mui/material';
import { Close, DragIndicator, ExpandMore, ExpandLess, Code, } from '@mui/icons-material';
import { editorContext } from "./context";
import { AiOutlinePushpin } from "react-icons/ai";
import { IoMove } from "react-icons/io5";
import { formatJsx } from './modules/export/utils';



export default function InspectorPanel ({ data, onClose }) {
    const refEditor = React.useRef({data: {}, call: (editObject)=> console.log(editObject)});
    const [mod, setMod] = useState<'json'|'render'>('json');
    const [cache, setCache] = useState<string>();
    const renderRef = React.useRef<HTMLDivElement>(null);
    const state = editorContext.inspector.use();
    const [width, setWidth] = useState(400);
    const draggingRef = React.useRef(false);
    const offsetRef = React.useRef({ x: 0, y: 0 });


    const style = {
        zIndex: 1500,
        width: '100%',
        maxHeight: '40vh',
        background: '#1e1e1e',
        color: 'white',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
    }

    const onMouseDown = (e: React.MouseEvent) => {
        draggingRef.current = true;
        const position = state.position;

        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    }
    const onMouseMove = (e: MouseEvent) => {
        if (draggingRef.current) {
            editorContext.inspector.position.set({
                x: e.clientX - offsetRef.current.x,
                y: e.clientY - offsetRef.current.y,
            });
        }
    }
    const onMouseUp = () => {
        draggingRef.current = false;
    }
    React.useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);
    React.useEffect(() => {
        if(mod === 'render') {
            setTimeout(()=> {
                renderRef.current && (renderRef.current.innerHTML = cache)
            }, 200);
        }

        if (!state?.colapsed?.value) {
            editorContext.inspector?.position?.set({ x: window.innerWidth - 60, y: 70 });
        }
        else {
            editorContext.inspector?.position?.set({ x: window.innerWidth - 400, y: 70 });
        }
    }, [state?.colapsed]);
    React.useEffect(()=> {
        const handle =({str, view})=> {
            formatJsx(str).then(console.log);
            
            if(view) {
                editorContext.inspector.position.set({
                    x: view?.x ?? state.position.x, 
                    y: view?.y ?? state.position.y
                });
                setWidth(view?.width ?? width)
            }

            setMod('render');
            editorContext.inspector.isAbsolute.set(true);
            setCache(str);
            if(renderRef.current) renderRef.current.innerHTML = str;
        }
        const handleJson =(data)=> {
            refEditor.current = data;
            editorContext.inspector.lastData.set(data.data);
            setMod('json');
            editorContext.inspector.isAbsolute.set(true);
        }
        
        editorContext.inspector?.lastData?.set({})
        EVENT.on('htmlRender', handle);
        EVENT.on('jsonRender', handleJson);
        return ()=> {
            EVENT.off('htmlRender', handle);
            EVENT.off('jsonRender', handleJson);
        }
    }, []);
   
    
    return (
        <Paper sx={ style }>
            <Box
                onMouseDown={onMouseDown}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1,
                    py: 0.5,
                    background: '#2d2d2d',
                    borderTop: '1px solid #5555559d',
                }}
            >
                <Box sx={{ display: 'flex',  ml:'auto' }}>
                    <IconButton size="small" onClick={() => editorContext.inspector.colapsed.set((collapsed)=> !collapsed)}>
                        {!state?.colapsed
                            ? <ExpandMore sx={{ color: '#aaa', fontSize:14 }} />
                            : <ExpandLess sx={{ color: '#aaa', fontSize:14 }} />
                        }
                    </IconButton>
                </Box>
            </Box>

            
            {state?.colapsed && (
                <>
                    <div ref={renderRef}/>
                    { mod === 'json' &&
                        <div>

                        </div>
                    }
                </>
            )}
        </Paper>
    );
}


/**
 * <JsonViewer
                            style={{
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                lineHeight: 1.4,
                                textAlign: 'left',
                            }}
                            value={state?.lastData}
                            editable
                            onChange={(p, oldVal, newVal) => {
                                state.lastData.set((old) => {
                                    const clone = structuredClone(old); // или deepClone(old)

                                    let target = clone;
                                    for (let i = 0; i < p.length - 1; i++) {
                                        target = target[p[i]];
                                    }
                                    target[p[p.length - 1]] = newVal;
                                    refEditor.current.call(clone);

                                    return clone;
                                });
                            }}
                            displayDataTypes={false}
                            defaultInspectDepth={3}
                            rootName={false}
                            theme="dark"
                        />
 */