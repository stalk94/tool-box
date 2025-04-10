import React from "react";
import { Button, useTheme } from "@mui/material";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import { Toolbar, Components } from './tools-bar';
import StaticGrid from './static';
import ContentEdit from './editor-text';
import { Descendant } from 'slate';
import "react-grid-layout/css/styles.css";
import "../../style/grid.css"
import { GridEditorProps, LayoutCustom } from './type';
import context from './context';
import { useHookstate } from "@hookstate/core";

const ResponsiveGridLayout = WidthProvider(Responsive);


// сетка редактор (с верхней панелькой и панелью заполнителей ячейки)
export default function ({ setLayout, layout, renderItems, tools, cache }: GridEditorProps) {
    const theme = useTheme();
    const [preview, setPreview] = React.useState(false);
    const [current, setCurrent] = React.useState<string | undefined>();
    const [margin, setMargin] = React.useState<[number, number]>([5, 5]);
    const containerRef = React.useRef(null);
    const layoutState = useHookstate(context.layout);
   

    const handlerLayoutChange =(currentLayout: Layout[], allLayouts: Layouts)=> {
        layout.map((elem)=> {
            if(elem.content) {
                const findIndex = currentLayout.findIndex(ce => ce.i === elem.i);
                if(findIndex !== -1) {
                    currentLayout[findIndex].content = elem.content;
                    layoutState.set(currentLayout);
                }
            }
        });

        setLayout(currentLayout);
    }
    const handlerAddItem = () => {
        layout.map((elem)=> {
            if(elem.content) {
                const findIndex = layout.findIndex(ce => ce.i === elem.i);
                if(findIndex !== -1) layout[findIndex].content = elem.content;
            }

            return elem;
        });

        const newItem: Layout = {
            i: String(Date.now()),
            x: 0,                     // Новая ячейка начинается с нулевой позиции
            y: Infinity,              // Автоматическое размещение внизу
            w: 1,                     // Ширина
            h: 1,                     // Высота
        };
        setLayout([...layout, newItem]); // Добавляем новую ячейку
    }
    const handlerDeleteItem = () => {
        if(current !== undefined) setLayout((items)=> {
            const findIndex = items.findIndex((item)=> item.i === current);
            if(findIndex !== -1) items.splice(findIndex, 1);
            
            return [...items];
        });
    }
    const handleItemClick = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setCurrent(id);
    }
    const setItemContent = (element: React.ReactNode, index: number) => {
        setLayout((items)=> {
            const findIndex = items.findIndex((elem)=> elem.i === current);
            if(findIndex!==-1) items[findIndex].content = index;

            return [...items];
        });
    }
    // для contenEditable
    const handlerChangeEditor =(value: Descendant, item: LayoutCustom)=> {
        const text = value[0].children[0].text;
        const findindex = cache.current.findIndex((cv)=> cv.i === item.i);

        if(findindex !== -1) {
            cache.current[findindex].content = text;
        }
    }
    React.useEffect(()=> {
        cache.current = layout;
    }, [layout]);


    return(
        <div style={{width: '100%', height: '100%'}}>
            {/* верхняя tool панель */}
            <div>
                <Toolbar
                    current={current}
                    useAdd={handlerAddItem}
                    useUndo={handlerDeleteItem}
                    tools={tools}
                />
            </div>
            {/* выбор заполнения ячейки ! доработать */}
            <Components
                visibility={Boolean(current)}
                onChange={setItemContent}
                items={renderItems}
            />

            <div 
                ref={containerRef}
                onClick={()=> setCurrent(undefined)}
                style={{
                    width: "100%", // Ширина родительского контейнера
                    height: "70%", // Высота родительского контейнера
                    maxHeight: "100%",
                    border: "1px dotted #fc9a9a58", // Для наглядности
                    position: "relative", // Для правильного позиционирования в родителе
                }}
            >
                <ResponsiveGridLayout
                    className="layout"
                    layouts={{ lg: layout }}                             
                    breakpoints={{ lg: 1200, md: 996, sm: 768 }}         // Ширина экрана для переключения
                    cols={{ lg: 12, md: 12, sm: 12 }}                    // Количество колонок для каждого размера
                    rowHeight={30}
                    onLayoutChange={handlerLayoutChange}
                    //compactType="vertical"
                    //preventCollision={true}
                    margin={margin}
                >
                    { layout.map((item, index) => (
                        <div className="react-grid-item"
                            key={item.i}
                            style={{
                                //textAlign: "center",
                                display: "flex",
                                justifyContent: 'center',
                                alignItems: "center",
                                flex: 1,
                                background: item.i === current ? '#f66a6a85' : theme.palette.background.paper,
                                overflow: 'auto',
                            }}
                            onClick={(e) => handleItemClick(item.i, e)}
                        >
                            <ContentEdit
                                key={item.i}
                                idLayout={item.i}
                                value={item.content ? item.content : `Block ${index}`}
                                onChange={(v)=> handlerChangeEditor(v, item)}
                            />
                            
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>

            {/* превью нашего компонента */}
            <div
                style={{
                    //margin: '1%',
                    position: 'fixed',
                    background: preview ? theme.palette.background.default : '#00000069',
                    right: 0,
                    bottom: 0,
                    top: preview && 0,
                    width: preview ? '90%' : '30%',
                    height: preview ? '100%' : '23%',
                    zIndex: 3,
                    //overflowY: "auto"
                }}
                onClick={() => setPreview(!preview)}
            >
                <StaticGrid
                    layout={layout}
                    margin={[5, 5]}
                //viewContent={renderItems}
                />
            </div>
        </div>
    );
}