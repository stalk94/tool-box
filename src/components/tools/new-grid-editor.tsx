import React from "react";
import { Button } from "@mui/material";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import { Toolbar, Components } from './tools-bar';
import StaticGrid from '../grid/static';
import "react-grid-layout/css/styles.css";
import "../../style/grid.css"


type LayoutCustom = Layout & {
    /** id рендер элемента */
    content?: number
}
type GridEditorProps = {
    setLayout: (old: Layout[])=> void
    layout: LayoutCustom[]
    renderItems: React.ReactNode
}

const ResponsiveGridLayout = WidthProvider(Responsive);


// сетка редактор (с верхней панелькой и панелью заполнителей ячейки)
export default function ({ setLayout, layout, renderItems }: GridEditorProps) {
    const [preview, setPreview] = React.useState(true);
    const [current, setCurrent] = React.useState<string | undefined>();
    const [margin, setMargin] = React.useState<[number, number]>([5, 5]);
    const containerRef = React.useRef(null);
   

    const handlerLayoutChange =(currentLayout: Layout[], allLayouts: Layouts)=> {
        layout.map((elem)=> {
            if(elem.content) {
                const findIndex = currentLayout.findIndex(ce => ce.i === elem.i);
                if(findIndex !== -1) currentLayout[findIndex].content = elem.content;
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
    

    return(
        <div style={{width: '100%', height: '100%'}}>
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

                {/* верхняя tool панель */}
                <div>
                    <Toolbar
                        current={current}
                        useAdd={handlerAddItem}
                        useUndo={handlerDeleteItem}
                        useClick={console.log}
                    />
                </div>
                {/* выбор заполнения ячейки */}
                <Components 
                    visibility={Boolean(current)}
                    onChange={setItemContent}
                    items={renderItems}
                />

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
                                background: item.i === current ? '#f66a6a85' : "#7dbce361",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: 'auto'
                            }}
                            onClick={(e) => handleItemClick(item.i, e)}
                        >
                            { item.content !== undefined
                                ? renderItems[item.content] 
                                : `Block ${index}`
                            }
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>

            {/* превью нашего компонента */}
            <React.Fragment>
                <div
                    style={{
                        margin: '1%',
                        position: 'fixed',
                        background: '#0000004d',
                        right: 0,
                        bottom: 0,
                        width: '30%',
                        maxHeight: '40%',
                        zIndex: 3,
                        visibility: preview ? 'visible' : 'hidden'
                        //overflowY: "auto"
                    }}
                    onClick={() => setPreview(false)}
                >
                    <StaticGrid
                        layout={layout}
                    />
                </div>
                { !preview &&
                    <Button 
                        onClick={()=> setPreview(true)}
                        style={{
                            margin:'1%',
                            position:'fixed',
                            right: 0,
                            bottom: 0,
                            zIndex: 3
                        }}
                    >
                        x
                    </Button>
                }
            </React.Fragment>
        </div>
    );
}