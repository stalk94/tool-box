import React from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "../../context";
import { useHookstate } from '@hookstate/core';
import { updateComponentProps } from '../../utils/updateComponentProps';
import { Power, LinkOff } from '@mui/icons-material';


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
    const infoState = useHookstate(useInfoState());
    const cellsContent = useHookstate(useCellsContent());
    const context = useHookstate(useEditorContext());
    const selected = infoState.select.content;
    const [visible, setVisible] = React.useState(false);


    React.useEffect(() => {
        const isSelected = selected.get({noproxy:true})?.props?.['data-id'] === id;
        const show = alwaysVisible || isSelected;
        setVisible(show);
        onVisibleChange?.(show);
    }, [selected, id, alwaysVisible]);


    return { visible, selected, context, cellsContent };
}


const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
    options,
    align = 'top',
    offsetY = -30,
    visible = true,
    position = 'right',
    width = '200px',
    sx
}) => {
    if (!visible) return null;

    let justifyContent: 'flex-start' | 'center' | 'flex-end' = 'center';
    if (position === 'left') justifyContent = 'flex-start';
    if (position === 'right') justifyContent = 'flex-end';


    return (
        <Box
            sx={{
                position: 'absolute',
                [align]: offsetY,
                [position]: 0, 
                top: 0,
                display: 'flex',
                justifyContent,
                width,
                gap: 0.5, 
                flexDirection: 'row',  
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(195, 96, 114, 0.052)',
                border: '1px dashed rgba(228, 87, 137, 0.529)',
                boxShadow: `
                    0px 2px 4px 0px rgba(0, 0, 0, 0.3),
                    0px 1px 5px 0px rgba(0, 0, 0, 0.2)`,
                zIndex: 100,
                pointerEvents: 'auto',
                ...sx
            }}
            style={{padding: '6px'}}
            onClick={(e) => e.stopPropagation()}
        >
            { options.map((opt, i) => (
                <IconButton
                    key={i}
                    size="small"
                    onClick={opt.action}
                    sx={{ color: '#ccc', fontSize: 14 }}
                >
                    { opt.icon }
                </IconButton>
            ))}
        </Box>
    );
}

export const LinktoolBar =({dataId, subs, onChange})=> {
    const [isThisSelect, setSelectThis] = React.useState(false);
    const ctx = useHookstate(useEditorContext());
    const info = useHookstate(useInfoState());
    const selectContent = info.select.content;

    const create = () => {
        const selectedProps = selectContent.get({noproxy: true})?.props
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
        const cur = selectContent.get({noproxy: true});

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

export default ContextualToolbar;