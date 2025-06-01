import React from 'react';
import { Rnd } from "react-rnd";
import { DropSlot, ContextSlot } from '../Dragable';
import { useComponentSizeWithSiblings } from './helpers/hooks';
import { ComponentSerrialize, Component, ComponentProps } from '../type';
import { editorContext } from "../context";
import { exportedFrame, exportedArea } from './export/bloks';
import { Paper } from '@mui/material';
import { getRelativeStylePercent } from '../helpers/editor';


type FrameWrapperProps = ComponentProps & {
    'data-id': number
    'data-type': 'Stack'
    fullWidth: boolean
    style: React.CSSProperties
    slots: Record<string, ComponentSerrialize>
}
type AreaProps = ComponentProps & {
    slots: Record<string, ComponentSerrialize>
}


export const FrameWrapper = React.forwardRef((props: FrameWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 'data-id': dataId, fullWidth, style={}, metaName, slots, ...otherProps } = props;
    const { width, height, container } = useComponentSizeWithSiblings(dataId);

    degidratationRef.current = (call) => {
        let metaNameParsed;
        if(metaName && metaName.length > 3) metaNameParsed = metaName;

        const code = slots[0]?.size ? exportedFrame(
            editorContext.meta.get(),
            slots[0],
            metaNameParsed
        ) : '';
        
        call(code);
    }
    React.useEffect(()=> {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.'+dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.'+dataId, handler);
        }
    }, []);
    

    
    return (
        <Paper
            component='div'
            ref={ref}
            data-id={dataId}
            data-type="Frame"
            style={{ 
                width: '100%',
                ...style, 
                borderWidth: '1px',
                border: style?.borderColor ? `1px solid ${style?.borderColor}` : 'none',
                borderStyle: style?.borderStyle ?? 'none',
                display: 'block', 
                height: height ?? '100%',
                zIndex: 2,
            }}
            { ...otherProps }
        >
            <ContextSlot
                type='Frame'
                idParent={dataId}
                idSlot={0}
                fullHeight={height}
                data={{
                    ...slots[0],
                    size: {
                        width: container.width,
                        height: container.height
                    }
                }}
                nestedComponentsList={{
                    Button: true,
                    IconButton: true,
                    Typography: true,
                    Avatar: true,
                    Rating: true,
                    Image: true,
                    Text: true,
                    List: true,
                    Divider: true
                }}
            />
        </Paper>
    );
});

export const AreaWrapper = React.forwardRef((props: AreaProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 'data-id': dataId, fullWidth, style={}, metaName, slots, ...otherProps } = props;
    const { width, height, container } = useComponentSizeWithSiblings(dataId);


    degidratationRef.current = (call) => {
        let metaNameParsed;
        if(metaName && metaName.length > 3) metaNameParsed = metaName;

        const code = exportedArea(
            editorContext.meta.get(),
            slots[0],
            metaNameParsed
        );
        
        call(code);
    }
    React.useEffect(()=> {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.'+dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.'+dataId, handler);
        }
    }, []);
    

    
    return (
        <Paper
            component='div'
            ref={ref}
            data-id={dataId}
            data-type="Area"
            style={{ 
                width: '100%',
                ...style, 
                position: 'relative',
                borderWidth: '1px',
                border: style?.borderColor ? `1px solid ${style?.borderColor}` : 'none',
                borderStyle: style?.borderStyle ?? 'none',
                display: 'block', 
                height: height ?? '100%',
                zIndex: 2,
            }}
            { ...otherProps }
        >
            <ContextSlot
                type='Area'
                idParent={dataId}
                idSlot={0}
                fullHeight={height}
                data={{
                    ...slots[0],
                    size: {
                        width: container.width,
                        height: container.height
                    }
                }}
                nestedComponentsList={{
                    Button: true,
                    IconButton: true,
                    Typography: true,
                    Avatar: true,
                    Rating: true,
                    Image: true,
                    Text: true,
                    List: true,
                    Divider: true
                }}
            />
        </Paper>
    );
});