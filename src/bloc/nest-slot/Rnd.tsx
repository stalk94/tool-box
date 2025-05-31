import React from 'react';
import { Rnd } from 'react-rnd';
import { editorSlice, infoSlice, renderSlice, cellsSlice } from "./context";
import { updateComponentProps } from './shim';


export function RndWrapper({ dataRnd, onClick, onDoubleClick, rowProps, children }) {
    const [position, setPosition] = React.useState({
        x: dataRnd.x ?? 0,
        y: dataRnd.y ?? 0,
        z: dataRnd.y ?? 3
    });
    const [size, setSize] = React.useState({
        width: dataRnd.width ?? 'auto',
        height: dataRnd.height ?? 'auto',
    });
    

    React.useEffect(() => {
        setSize({
            width: dataRnd.width ?? 'auto',
            height: dataRnd.height ?? 'auto',
        });
    }, [dataRnd.width, dataRnd.height]);
    React.useEffect(() => {
        setPosition({
            x: dataRnd.x ?? 0,
            y: dataRnd.y ?? 0,
            z: dataRnd.y ?? 3
        });
    }, [dataRnd.y, dataRnd.x]);
    

    return (
        <Rnd
            ref-id={rowProps['data-id']}
            size={size}
            position={position}
            bounds="parent"
            style={{
                position: 'absolute',
                zIndex: position.z,
                height: 'auto',
                display: 'inline-block',
                border: '1px dotted #eb6be73b',
                backgroundImage: `repeating-linear-gradient(
                    45deg,
                    #968d8d1a 0px,
                    #6161611a 1px,
                    transparent 1px,
                    transparent 8px
                )`,
            }}
            onClick={(e)=> {
                e.stopPropagation();
                onClick(e.currentTarget);
            }}
            onDoubleClick={(e)=> {
                e.stopPropagation();
                onDoubleClick(e.currentTarget);
            }}
            onDragStart={(e)=> {
                
            }}
            onDragStop={(e, d) => {
                setPosition({x: d.x, y: d.y, z: d.y});
                
                updateComponentProps({
                    component: { props: rowProps },
                    data: {
                        style: { 
                            ...rowProps.style, 
                            ...{y: d.y, x: d.x, zIndex: d.y } 
                        }
                    }
                });
            }}
            onResizeStop={(e, dir, ref, delta, pos) => {
                const newSize = {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                }
                
                setSize(newSize);
                updateComponentProps({
                    component: { props: rowProps },
                    data: {
                        style: { ...rowProps.style, ...newSize }
                    }
                });
            }}
        >
            { children }
        </Rnd>
    );
}
