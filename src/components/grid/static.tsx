import React from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "../../style/grid.css"


type StaticGridProps = {
    layout: Layout & {
        /** id рендер элемента */
        content?: number
    }[]
    margin?: [number, number]
    /** массив компонентов с которым будут сопоставлятся ячейки, усли `undefined` то будет визуализация в режиме макета */
    viewContent?: React.ReactNode[]
}


const ResponsiveGridLayout = WidthProvider(Responsive);
const initLayouts: Layouts = {
    // Широкий экран
    lg: [
        { i: "0", x: 0, y: 0, w: 4, h: 2 }, 
        { i: "1", x: 0, y: 0, w: 4, h: 1 }, 
        { i: "2", x: 4, y: 0, w: 4, h: 1 },
    ],
    // Средний экран
    md: [
        { i: "0", x: 0, y: 0, w: 3, h: 2 }, 
        { i: "1", x: 3, y: 0, w: 3, h: 2 },
        { i: "2", x: 6, y: 0, w: 3, h: 2 },
    ],
    // Мобильный экран
    sm: [
        { i: "0", x: 0, y: 0, w: 6, h: 1 }, 
        { i: "1", x: 0, y: 2, w: 6, h: 1 },
        { i: "2", x: 0, y: 4, w: 6, h: 1 },
    ],
}


// сетка будет соответствовать схеме
export default function StaticGrid({ layout, margin, viewContent }: StaticGridProps) {;
    const containerRef = React.useRef(null);
    const [rowHeight, setRowHeight] = React.useState(30);

    
    const normalizeLayout = (layout: Layout[]) => {
        // Сгруппируем ячейки по строкам (по оси y)
        const rows = layout.reduce((acc, item) => {
            acc[item.y] = acc[item.y] || [];
            acc[item.y].push(item);
            return acc;
        }, {} as Record<number, Layout[]>);
    
        // Найдем строку с максимальной суммой ширины
        const maxRowWidth = Math.max(
          ...Object.values(rows).map((row) =>
            row.reduce((sum, item) => sum + item.w, 0)
          )
        );
    
        // Пересчитаем ширину для каждой ячейки
        const result = layout.map((item) => ({
            i: item.i,
            h: item.h,
            y: item.y,
            x: item.x,
            w: Math.round((item.w / maxRowWidth) * 12),
        }));

        return result;
    }
    function calculateMaxColumns(layout) {
        if (!layout || layout.length === 0) {
            return 12; // Возвращаем 12 как стандартное количество колонок
        }

        // Найти максимальное значение x + w среди всех элементов
        const maxColumns = layout.reduce((max, obj) => {
            const endColumn = obj.x + obj.w; // Позиция конечной колонки элемента
            return Math.max(max, endColumn);
        }, 0);

        return maxColumns; // Убедиться, что минимум 12 колонок
    }
    React.useEffect(() => {
        if(!margin) margin = [5, 5];
        // Обновляем максимальное количество колонок
        const resizeObserver = new ResizeObserver(() => {          
            if (containerRef.current) {
                const parentHeight = containerRef.current.clientHeight; // Получаем высоту родительского контейнера
                //const containerWidth = containerRef.current.offsetWidth;
                

                // Рассчитываем количество строк, исходя из переданной схемы
                const maxY = Math.max(...layout.map((item) => item.y + item.h)); // Определяем максимальное значение по оси y
                const rows = maxY; // Количество строк = максимальное значение y + 1

                const totalVerticalMargin = margin[1] * (rows+1) ; // Суммарные вертикальные отступы для всех строк
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

   
    return (
        <div
            ref={containerRef}
            style={{
                position: "relative", // Для правильного позиционирования в родителе
                height: '100%',
            }}
        >
            <ResponsiveGridLayout
                //measureBeforeMount={true}
                className="layout"
                layouts={{ lg: layout }}        // Схема сетки
                breakpoints={{ lg: 0 }}         // Точки для респонсива
                cols={{ lg: 12 }}
                rowHeight={rowHeight}
                compactType={null}              // Отключение автоматической компоновки
                isDraggable={false}             // Отключить перетаскивание
                isResizable={false}             // Отключить изменение размера
                margin={margin ?? [5, 5]}
            >
                {!viewContent && layout.map((item) => (
                    <div key={item.i} style={{ background: "lightgray", textAlign: "center" }}/>
                ))}

                {/* рабочий режим (отображаем контент в ячейках) */}
                {viewContent && layout.map((item, index) => (
                    <div 
                        key={item.i} 
                        style={{ 
                            display: "flex",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: 'auto'
                        }}
                    >
                        { viewContent[item?.content]?.render() || 'empty' }
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}