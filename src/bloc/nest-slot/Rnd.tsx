import React from 'react';
import { Rnd } from 'react-rnd';
import { editorSlice, infoSlice, renderSlice, cellsSlice, guidesSlice } from "./context";
import { updateComponentProps } from './helpers/shim';
import { snapToGuides } from './helpers/guides';



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
            dragGrid={[10, 10]}
            resizeGrid={[10, 10]} 
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
                const guides = guidesSlice.get();

                const snappedX = snapToGuides(d.x, guides.x);
                const snappedY = snapToGuides(d.y, guides.y);
                setPosition({ x: snappedX, y: snappedY, z: position.z });
                
                updateComponentProps({
                    component: { props: rowProps },
                    data: {
                        style: {
                            ...rowProps.style,
                            x: snappedX,
                            y: snappedY,
                            zIndex: position.z,
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