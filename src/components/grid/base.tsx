import React from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";


const ResponsiveGridLayout = WidthProvider(Responsive);
const initLayouts: Layouts = {
    // Широкий экран
    lg: [
        { i: "1", x: 0, y: 0, w: 4, h: 1 }, 
        { i: "2", x: 4, y: 0, w: 4, h: 1 },
        { i: "3", x: 8, y: 0, w: 4, h: 1 },
    ],
    // Средний экран
    md: [
        { i: "1", x: 0, y: 0, w: 3, h: 2 }, 
        { i: "2", x: 3, y: 0, w: 3, h: 2 },
        { i: "3", x: 6, y: 0, w: 3, h: 2 },
    ],
    // Мобильный экран
    sm: [
        { i: "1", x: 0, y: 0, w: 6, h: 1 }, 
        { i: "2", x: 0, y: 2, w: 6, h: 1 },
        { i: "3", x: 0, y: 4, w: 6, h: 1 },
    ],
}


export default function ({ onChange }) {
    const counter = React.useRef(0);
    const [layout, setLayout] = React.useState<Layout[]>([]);
    const [layouts, setLayouts] = React.useState<Layouts>(initLayouts);     // схема для разных экранов, надо реализовать


    const handlerLayoutChange =(currentLayout: Layout[], allLayouts: Layouts)=> {
        // сохраняем текуший при изменении!
        setLayouts(allLayouts);
        setLayout(currentLayout);
    }
    const handlerAddItem = () => {
        const newItem: Layout = {
            i: String(counter.current++),
            x: 0,                     // Новая ячейка начинается с нулевой позиции
            y: Infinity,              // Автоматическое размещение внизу
            w: 2,                     // Ширина
            h: 2,                     // Высота
        };
        setLayout([...layout, newItem]); // Добавляем новую ячейку
    }


    
    return(
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}                                   //* Передаем макеты для всех размеров
            breakpoints={{ lg: 1200, md: 996, sm: 768 }}        // Ширина экрана для переключения 
            cols={{ lg: 12, md: 10, sm: 6 }}                    // Количество колонок для каждого размера
            rowHeight={60}
            width={1200}                                        // Максимальная ширина контейнера
            onLayoutChange={handlerLayoutChange}
        >
            {layout.map((item, index) => (
                <div
                    key={item.i}
                    style={{
                        background: "lightblue",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {`Block ${item.i}`}
                </div>
            ))}
        </ResponsiveGridLayout>
    );
}