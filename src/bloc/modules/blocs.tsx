import React from 'react';
import { DropSlot, ContextSlot } from '../Dragable';
import { useComponentSizeWithSiblings } from './helpers/hooks';
import { ComponentSerrialize, Component, ComponentProps } from '../type';
import { useEditorContext } from "../context";
import { exportedFrame } from './export/Acordeon';
import { Paper } from '@mui/material';


type FrameWrapperProps = ComponentProps & {
    'data-id': number
    'data-type': 'Stack'
    fullWidth: boolean
    style: React.CSSProperties
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
            useEditorContext().meta.get({noproxy:true}),
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
                    Typography: true
                }}
            />
        </Paper>
    );
});





/**
 * const SlotRenderWrapper = ({ isDirectionColumn, fullWidth, children, index, select, setSelect, onAdd }) => {
    const buffer = useHookstate(useEditorContext().buffer);
    const typeAcessTest = ['Button', 'IconButton', 'Chip', 'List', 'Card', 'Text', 'Typography'];
   
    const useWidth =()=> {
        if(isDirectionColumn && fullWidth) return '100%';
        else if(fullWidth) return '100%';
        else return "fit-content";
    }
    const renderAdd =()=> {
        return (
            <>
                {typeAcessTest.map((key, i) =>
                    <Button key={i}
                        variant="outlined"
                        style={{ color: '#fcfcfc', borderColor: '#fcfcfc61', boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.4)' }}
                        startIcon={<Add sx={{ color: 'gray', fontSize: 18 }} />}
                        sx={{ width: '100%', opacity: 0.6, mt: 0.7 }}
                        onClick={() => onAdd(createComponentFromRegistry(key), index)}

                    >
                        {typeAcessTest[i]}
                    </Button>
                )}
            </>
        );
    }
   

    return (
        <div key={index}
            onClick={(e)=> setSelect(index)}
            style={{
                position: 'relative',
                width: useWidth(),
                height: !isDirectionColumn ? '100%' : "fit-content",
                border: select === index ? '1px dotted #7de24a8d' : '1px dotted #68bacd8d',
                background: select === index ? '#35422e10' : 'transparent'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    padding: 0,
                    borderRadius: 3,
                    top: -25,
                    right: 0,
                    visibility: select === index ? 'visible' : 'hidden',
                    zIndex: 6
                }}
            >
                <IconButton disabled={!buffer.get()} onClick={()=> onAdd(buffer.get({noproxy:true}), index, true)}>
                    <FaPaste size={16} />
                </IconButton>
                <IconButton onClick={()=> onAdd(undefined, index)}>
                    <DeleteForever sx={{fontSize:20}} />
                </IconButton>
            </div>
            {!children &&
                <div
                    style={{
                        padding: 24,
                        margin: 'auto',
                        fontSize: 12,
                        color: 'gray'
                    }}
                >
                    empty
                </div>
            }
            {children &&
                <div

                >
                    {children}
                </div>
            }

        </div>
    );
}


export const StackWrapperNewStyle = React.forwardRef((props: StackWrapperProps, ref) => {
    const selectSlotCtx = useSelectSlot();                  // выбранный слот (глобальный контекст)
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const [select, setSelect] = React.useState<number>();
    const [renderSlots, setRender] = React.useState<Record<string, Component>>({});
    const { 'data-id': dataId, fullWidth, style, count, slots, isDirectionColumn, ...otherProps } = props;
    

    degidratationRef.current = (call) => {
        const code = (`
            
        `);
        
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
    const addComponentToSlot =(component: Component, index: number, isJson?: boolean)=> {
        const serialized = component 
            ?   (isJson
                    ? (()=> {
                        component.props['data-slot'] = dataId;
                        component.props['data-id'] = Date.now();
                        return component;

                    })()
                    : serrialize(React.cloneElement(component, { 'data-slot': dataId}),  dataId)
                )
            : undefined;

        updateComponentProps({
            component: { props },
            data: {
                slots: {
                    ...slots,
                    [index]: serialized
                }
            }
        });
    }
    const handleSelectSlot =(indexSlot: number)=> {
        setSelect(indexSlot);

        selectSlotCtx.set({
            index: indexSlot,
            component: renderSlots[indexSlot],
            parent: props,
        });
    }
    const handleSlotUpdate = (ev: { data: ComponentProps, index: number }) => {
        const { data: newData, index } = ev;
        const slotsCopy = { ...slots };
        if(slots[index]) slotsCopy[index].props = newData;

        if(slots[index]) updateComponentProps({
            component: { props },
            data: {
                slots: {
                    ...slotsCopy
                }
            }
        });
    }
    const useRenderSlots = () => {
        const copySlots: Record<string, Component> = {};

        for (let i = 0; i < count; i++) {
            if(!slots[i]) copySlots[i] = undefined;
            else copySlots[i] = desserealize(slots[i], { 'data-slot': dataId });
        }

        setRender(copySlots);
    }
    React.useEffect(()=> {
        EVENT.on('slotUpdate.'+ dataId, handleSlotUpdate);
        return ()=> EVENT.off('slotUpdate.'+ dataId, handleSlotUpdate);
    }, []);
    React.useEffect(useRenderSlots, [count, slots]);
    
    
    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type="Stack"
            style={{
                ...style,
                borderTop: '1px dotted #aaafb045',
                borderBottom: '1px dotted #aaafb045',
                padding: '5px 1px',
                width: fullWidth ? "100%" : "fit-content"
            }}
        >
            <Stack
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
                direction={isDirectionColumn ? 'column' : 'row'}
                {...otherProps}
            >
                { Object.entries(renderSlots).map(([id, component], index)=> 
                    <SlotRenderWrapper 
                        key={id}
                        index={index}
                        fullWidth={fullWidth}
                        isDirectionColumn={isDirectionColumn}
                        select={select}
                        setSelect={handleSelectSlot}
                        onAdd={addComponentToSlot}
                    >
                        { component }
                    </SlotRenderWrapper>
                )}
            </Stack>
        </div>
    );
});
 */