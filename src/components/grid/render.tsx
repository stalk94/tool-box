import React from "react";
import { Button, useTheme } from "@mui/material";
import { GridEditorProps, LayoutCustom } from './type';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "../../style/grid.css"
import context from './context';
import { useHookstate } from "@hookstate/core";

const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];





export default function ({ }) {
    const [render, setRender] = React.useState<LayoutCustom []>([]);
    const containerRef = React.useRef(null);
    const [rowHeight, setRowHeight] = React.useState(30);
    const layout = useHookstate(context.layout);
    

    React.useEffect(() => {
        // Обновляем максимальное количество колонок
        const resizeObserver = new ResizeObserver(() => {
            const cur = layout.get({ noproxy: true });
            setRender(cur);
            console.log(cur)

            if (containerRef.current) {
                const parentHeight = containerRef.current.clientHeight; // Получаем высоту родительского контейнера
                //const containerWidth = containerRef.current.offsetWidth;


                // Рассчитываем количество строк, исходя из переданной схемы
                const maxY = Math.max(...cur.map((item) => item.y + item.h)); // Определяем максимальное значение по оси y
                const rows = maxY; // Количество строк = максимальное значение y + 1

                const totalVerticalMargin = margin[1] * (rows + 1); // Суммарные вертикальные отступы для всех строк
                const availableHeight = parentHeight - totalVerticalMargin; // Доступная высота без отступов

                setRowHeight(availableHeight / rows); // Вычисляем высоту строки
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => {
            resizeObserver.disconnect();
        };
    }, [layout]);


    return(
        <div
            ref={containerRef}
            style={{width: '100%'}}
        >
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: render }}        // Схема сетки
                breakpoints={{ lg: 0 }}         // Точки для респонсива
                cols={{ lg: 12 }}
                rowHeight={rowHeight}
                compactType={null}              // Отключение автоматической компоновки
                isDraggable={false}             // Отключить перетаскивание
                isResizable={false}             // Отключить изменение размера
                margin={margin}
            >
                { render.map((item) => (
                    <div key={item.i}
                        style={{ textAlign: "center", border:'1px solid red' }} 
                    >
                        {item.i}
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}