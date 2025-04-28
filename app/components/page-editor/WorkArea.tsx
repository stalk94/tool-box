'use client'
import React from "react";
import "react-grid-layout/css/styles.css";
import { useEditor } from './context';
import { RenderPageProps, LayoutPage, PageComponent } from '../../types/page';
import RenderBlock from '../RenderBlock';
import { DataRenderGrid } from '../../types/editor';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
export const BREAKPOINT_WIDTH = { lg: 1200, md: 960, sm: 600, xs: 460 } as const;


const SortableItem = ({ id, children, style }: { id: string, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const { selectedBlock, setSelectedBlock } = useEditor();

    const curStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
        marginTop: '5px',
    }
    const handleClick = (e: React.MouseEvent) => {
        console.log('click')
        e.stopPropagation();
        setSelectedBlock(id);
    }


    return (
        <div 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={curStyle}
            className={`${(selectedBlock === id && !isDragging) ? 'editor-selected' : ''}`}
            onClick={handleClick}
        >
            { children }
        </div>
    );
}



// решить проблему с высотой блоков (ее можно получить из схемы)
// получить breacpoint key для блоков исходя из size их схемы
export default function WorkArea({ marginCell }: RenderPageProps) {
    const workAreaRef = React.useRef<HTMLDivElement>(null);
    const { 
        zoom,
        setZoom,
        selectedBlock,
        curentPageData, 
        setCurrentPageData,
        curentPageName, 
        curBreacpoint, 
        setCurBreacpoint, 
        selectBlockData, 
        setSelectBlockData,
        setSelectedBlock,
    } = useEditor();
    const [layouts, setLayouts] = React.useState<Record<'lg' | 'md' | 'sm' | 'xs', LayoutPage[]>>({
        lg: [],
        md: [],
        sm: [],
        xs: []
    });
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );
    

    const getClosestLayout = (bp: string): LayoutPage[] => {
        const order: string[] = ['lg', 'md', 'sm', 'xs'];
        const start = order.indexOf(bp);

        for (let i = start; i >= 0; i--) {
            const layout = layouts[order[i] as keyof typeof layouts];
            if (layout && layout.length > 0) {
                return layout;
            }
        }

        for (let i = start + 1; i < order.length; i++) {
            const layout = layouts[order[i] as keyof typeof layouts];
            if (layout && layout.length > 0) {
                return layout;
            }
        }

        return [];
    }
    const addBlockToPage = (data: DataRenderGrid) => {
        const variantLayout = curentPageData.variants[curBreacpoint];
        
        if (!variantLayout) return;

        const layoutList = variantLayout.layout ?? [];
        const newId = `block-${Date.now()}`;

        const newBlock: LayoutPage = {
            i: newId,
            content: {
                props: {
                    'data-block-scope': data.meta.scope,
                    'data-block-name': data.meta.name,
                    style: {}
                }
            }
        }

        const newLayout = [...layoutList, newBlock];

        setLayouts(prev => ({
            ...prev,
            [curBreacpoint]: newLayout,
        }));
        setCurrentPageData(prev => ({
            ...prev,
            variants: {
                ...prev.variants,
                [curBreacpoint]: {
                    ...prev.variants[curBreacpoint],
                    layout: newLayout,
                }
            }
        }));

        setSelectedBlock(newId);
        setSelectBlockData(null);

        //? костыль для next
        const memory = curBreacpoint;
        setCurBreacpoint('m');
        setTimeout(()=> setCurBreacpoint(memory), 600);
    }
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        if (active?.id) {
            setSelectedBlock(active.id as string);
        }
    }
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const layoutList = getClosestLayout(curBreacpoint);
        const oldIndex = layoutList.findIndex(item => item.i === active.id);
        const newIndex = layoutList.findIndex(item => item.i === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newLayout = arrayMove(layoutList, oldIndex, newIndex);

            setLayouts(prev => ({
                ...prev,
                [curBreacpoint]: [...newLayout],
            }));

             if (curentPageData) {
                 setCurrentPageData((prev) => ({
                     ...prev,
                     variants: {
                         ...prev.variants,
                         [curBreacpoint]: {
                             ...prev.variants[curBreacpoint],
                             layout: [...newLayout],
                         }
                     }
                 }));
            }
        }
    }
    const deleteSelectedBlock = () => {
        if (!selectedBlock) return;

        const layoutList = getClosestLayout(curBreacpoint);
        const newLayout = layoutList.filter(block => block.i !== selectedBlock);

        // Обновляем layouts
        setLayouts(prev => ({
            ...prev,
            [curBreacpoint]: newLayout,
        }));

        // Обновляем curentPageData
        setCurrentPageData(prev => ({
            ...prev,
            variants: {
                ...prev.variants,
                [curBreacpoint]: {
                    ...prev.variants[curBreacpoint],
                    layout: newLayout,
                }
            }
        }));

        setSelectedBlock(null);
    }

    React.useEffect(() => {
        const area = workAreaRef.current;
        if (!area) return;

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                setZoom(prev => Math.max(0.1, Math.min(5, prev - e.deltaY * 0.001)));
            }
        };

        area.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            area.removeEventListener('wheel', handleWheel);
        };
    }, []);
    React.useEffect(() => {
        if (curentPageData) {
            const layoutsFromData: Record<('lg' | 'md' | 'sm' | 'xs'), LayoutPage[]> = {};

            Object.entries(curentPageData.variants).forEach(([key, value]) => {
                if (value?.layout) layoutsFromData[key as 'lg' | 'md' | 'sm' | 'xs'] = value.layout;
            });
            

            setLayouts(layoutsFromData);
        }
    }, [curentPageData]);
    React.useEffect(()=> {
        if(selectBlockData) addBlockToPage(selectBlockData);
    }, [selectBlockData]);
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete') {
                deleteSelectedBlock();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedBlock, curBreacpoint]);
    const layoutList = getClosestLayout(curBreacpoint);
    

    return (
        <div
            ref={workAreaRef}
            data-name={curentPageName}
            style={{
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid gray',
                height: '100%',
            }}
        >
            <div
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    width: BREAKPOINT_WIDTH[curBreacpoint] ?? '100%',                    //? меняем ширину и меняется layout
                    height: 'fit-content'
                }}
            >
                 <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={layoutList.map(item => item.i)} strategy={verticalListSortingStrategy}>
                        { layoutList.map(layout => (
                            <SortableItem key={layout.i} id={layout.i}>
                                {layout.content ? (
                                    <RenderBlock
                                        scope={layout.content.props['data-block-scope']}
                                        name={layout.content.props['data-block-name']}
                                        style={layout.content.props?.style}
                                    />
                                ) : (
                                    <div>Ошибка блока</div>
                                )}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}


/**
 * { layoutList?.map((layout: LayoutPage) => (
                        <div 
                            key={layout.i} 
                            data-grid-id={layout.i} 
                            style={{ width: '100%'}}
                        >
                            { createComponent(layout) }
                        </div>
                    ))}
 */