import React from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { editorContext, cellsSlice, infoSlice } from "../../context";
import { updateComponentProps } from '../../helpers/updateComponentProps';
import { Power, LinkOff, Add, Remove } from '@mui/icons-material';
import { serializeJSX } from '../../helpers/sanitize';



export type ToolbarOption = {
    icon: React.ReactNode;
    action: () => void;
    tooltip?: string;
}
export type ContextualToolbarProps = {
    options: ToolbarOption[];
    align?: 'top' | 'bottom';
    offsetY?: number;
    visible?: boolean;
    position?: 'center' | 'left' | 'right';
}
export function useToolbar(id: number, onVisibleChange?: (v: boolean)=> void, alwaysVisible = false) {
    const selected = infoSlice.select.content;
    const [visible, setVisible] = React.useState(false);


    React.useEffect(() => {
        const isSelected = selected.get()?.props?.['data-id'] === id;
        const show = alwaysVisible || isSelected;
        setVisible(show);
        onVisibleChange?.(show);
    }, [selected, id, alwaysVisible]);


    return { visible, selected, editorContext, cellsSlice };
}


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


export const LinktoolBar =({dataId, subs, onChange})=> {
    const [isThisSelect, setSelectThis] = React.useState(false);
    const selectContent = infoSlice.select.content;

    const create = () => {
        const selectedProps = selectContent.get()?.props
        const selectedSubs: string[] = selectedProps?.['data-subs'] ?? [];
        const options = [];

        if(isThisSelect) {
            // инфо панель выбранного
        }
        else {
           
            // текуший выбранный подписан на события 
            if(selectedSubs?.includes?.(String(dataId))) {
                options.push({
                    action: ()=> updateComponentProps({
                        component: { props: selectedProps },
                        data: { ['data-subs']: selectedSubs.filter(id => id !== String(dataId)) }
                    }),
                    icon: <LinkOff sx={{color:'red'}}/>
                });
            }
            else options.push({
                action: () => updateComponentProps({
                    component: { props: selectedProps },
                    data: { ['data-subs']: [...selectedSubs, String(dataId)] }
                }),
                icon: <Power sx={{ color: 'green' }} />
            });
        }

        return options;
    }
    React.useEffect(()=> {
        const cur = selectContent.get();

        if(cur) {
            const selectDataId = cur?.props['data-id'];
            if(selectDataId === dataId) setSelectThis(true);
            else setSelectThis(false);
        }
    }, [selectContent])


    return(
        <ContextualToolbar
            visible={true}
            options={create()}
            sx={{width: 80, height: 30}}
        />
    );
}
export const SlotToolBar =({ dataId, type, children })=> {
    const selectedContent = infoSlice.select.content.use();
    const [isThisSelect, setSelectThis] = React.useState(false);
    const listAcess = ['Accordion', 'Tabs', 'BottomNav', 'List', 'PromoBanner'];
    
    if(!listAcess.includes(type)) return;

    const getNewValue = (selectedProps) => {
        if (type === 'Tabs') return `link-${selectedProps.items.length}`;
        else if (type === 'BottomNav') return {
            icon: 'Settings',
            label: 'test'
        }
        else if (type === 'List') return {
            startIcon: 'Settings',
            primary: 'primary',
            secondary: 'secondary'
        }
        else if (type === 'PromoBanner') return {
            title: 'Title',
            buttonText: "ПОДРОБНЕЕ",
            description: 'custom editable description',
            images: [`https://placehold.co/600x400/353636/gray?text=PromoImage${selectedProps.items.length}&font=roboto`]
        }
        else return {
            title: `・title-${selectedProps.items.length}`,
            content: serializeJSX(<Box sx={{ m: 3 }}>content</Box>)
        }
    }
    React.useEffect(()=> {
        const selectContent = infoSlice.select.content.get();
        const selectDataId = selectContent?.props?.['data-id'];

        if(selectDataId === dataId) setSelectThis(true);
        else setSelectThis(false);
    }, [children, selectedContent])
   

    return(
        <ContextualToolbar
            visible={isThisSelect}
            options={[
                {
                    action: () => {
                        updateComponentProps({
                            component: { props: children.props },
                            data: { items: children.props.items.slice(0, -1) }
                        })
                    },
                    icon: <Remove sx={{ color: '' }} />
                },
                {
                    action: () => {
                        const newItem = getNewValue(children.props);

                        updateComponentProps({
                            component: { props: children.props },
                            data: { items: [...children.props.items, newItem] }
                        })
                    },
                    icon: <Add sx={{ color: '' }} />
                },
            ]}
            align='top'
            offsetY={0}
            sx={{ width: 80, height: 30 }}
        />
    );
}



export default ContextualToolbar;