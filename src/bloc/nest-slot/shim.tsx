import React from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { useHookstate } from '@hookstate/core';
import { Power, LinkOff, Add, Remove } from '@mui/icons-material';
import { serializeJSX } from '../utils/sanitize';
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "./context";


export function updateComponentProps({ component, data, rerender = true }: Params) {
    const context = useEditorContext();
    const cellsContent = useCellsContent();
    const infoState = useInfoState();
    const renderState = useRenderState();
    const id = component?.props?.['data-id'];
    const cellId = context.currentCell.get()?.i;

    if (!id || !cellId) {
        console.warn('updateComponentProps: отсутствует data-id или data-cell');
        return;
    }
    
    // 🧠 Обновляем данные в hookstate-кэше
    cellsContent.set((old) => {
        const index = old[cellId]?.findIndex((c) => c.id === id);
        if (index !== -1) {
            Object.entries(data).forEach(([key, value]) => {
                old[cellId][index].props[key] = value;
            });
        }
        return old;
    });

    // 🔁 Обновляем визуальный рендер через context.render
    if (rerender) renderState.set((layers) => {
        console.log('update props: ', component, data);
        
        const updated = layers.map((layer) => {
            if (!Array.isArray(layer.content)) return layer;
            
            const i = layer.content.findIndex((c) => c?.props?.['data-id'] === id);

            if (i === -1) return layer;
            //! возможно слотовой
            else {
               
            }
            
            const current = layer.content[i];
            if (!current) {
                console.warn('updateComponentProps: компонент не найден в render');
                return layer;
            }

            try {
                const updatedComponent = React.cloneElement(current, {
                    ...current.props,
                    ...data,
                });

                console.log(updatedComponent)
                infoState.select?.content?.set(updatedComponent);         // fix
                layer.content[i] = updatedComponent;
            } 
            catch (e) {
                console.error('❌ Ошибка при клонировании компонента:', e, current);
            }

            return layer;
        });

        return [...updated];
    });
}




////////////////////////////////////////////////////////////
//  shim add slot
////////////////////////////////////////////////////////////
const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
    options,
    align = 'top',
    offsetY = -30,
    visible = true,
    position = 'right',
    sx
}) => {
    if (!visible) return null;
    const [widths, setWidth] = React.useState(40);
    let justifyContent: 'flex-start' | 'center' | 'flex-end' = 'center';
    if (position === 'left') justifyContent = 'flex-start';
    if (position === 'right') justifyContent = 'flex-end';

    const f =()=> {
        if(widths < 50) return [options.at?.(-1)];
        else return options;
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                [align]: offsetY,
                [position]: 0, 
                display: 'flex',
                justifyContent,
                gap: 0.5, 
                flexDirection: 'row',  
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(82, 82, 82, 0.901)',
                border: '1px solid rgba(239, 238, 236, 0.627)',
                boxShadow: `
                    0px 2px 4px 0px rgba(0, 0, 0, 0.3),
                    0px 1px 4px 0px rgba(0, 0, 0, 0.54)`,
                zIndex: 999,
                pointerEvents: 'auto',
                ...sx,
                width: widths,
            }}
            onMouseEnter={()=> setWidth(sx?.width)}
            onMouseLeave={()=> setWidth(40)}
            style={{padding: '6px'}}
            onClick={(e) => e.stopPropagation()}
        >
            { f().map((opt, i) => (
                <IconButton
                    key={i}
                    size="small"
                    onClick={opt.action}
                    sx={{ color: '#ccc', fontSize: 14,mr:-0.5 }}
                >
                    { opt.icon }
                </IconButton>
            ))}
        </Box>
    );
}
export const SlotToolBar =({ dataId, type, item })=> {
    const [isThisSelect, setSelectThis] = React.useState(false);
    const info = useHookstate(useInfoState());
    const selectContent = info.select.content;
    
    if(type !== 'Accordion' && type !== 'Tabs' &&  type !== 'BottomNav') return;
    const getOptions = () => {
        const getNewValue =(selectedProps)=> {
            if (type === 'Tabs') return `link-${selectedProps.items.length}`;
            else if(type === 'BottomNav') return {
                icon: 'Settings',
                label: 'test'
            }
            else return {
                title: serializeJSX(<Box sx={{ ml: 1.5 }}>・test-{selectedProps.items.length}</Box>),
                content: serializeJSX(<Box sx={{ m: 3 }}>content</Box>)
            }
        }

        return [
            {
                action: () => {
                    const selectedProps = selectContent.get({ noproxy: true })?.props;

                    updateComponentProps({
                        component: { props: selectedProps },
                        data: { items: selectedProps.items.slice(0, -1) }
                    })
                },
                icon: <Remove sx={{ color: '' }} />
            },
            {
                action: () => {
                    const selectedProps = selectContent.get({ noproxy: true })?.props;
                    const newItem = getNewValue(selectedProps);

                    updateComponentProps({
                        component: { props: selectedProps },
                        data: { items: [...selectedProps.items, newItem] }
                    })
                },
                icon: <Add sx={{ color: '' }} />
            },
        ];
    }
    React.useEffect(()=> {
        const cur = selectContent.get({noproxy: true});

        if(cur) {
            const selectDataId = cur?.props['data-id'];
            if(selectDataId === dataId) setSelectThis(true);
            else setSelectThis(false);
        }
    }, [selectContent])


    return(
        <ContextualToolbar
            visible={isThisSelect}
            options={getOptions()}
            align='top'
            offsetY={0}
            sx={{width: 80, height: 30}}
        />
    );
}
