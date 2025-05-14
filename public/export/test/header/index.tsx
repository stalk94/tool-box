import cell_1746978848104 from './cell-1746978848104.tsx';
import cell_1746978852542 from '../shared/cell-1746978852542.tsx';
import cell_1746978863758 from './cell-1746978863758.tsx';
import cell_1747137570401 from './cell-1747137570401.tsx';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function RenderGrid() {
    return (
        <ResponsiveGridLayout
            style={{}}
            className="GRID-EDITOR"
            layouts={{
                lg: [
                    {
                        i: 'cell-1746978848104',
                        x: 2,
                        y: 2,
                        w: 4,
                        h: 3,
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1746978852542',
                        x: 0,
                        y: 0,
                        w: 12,
                        h: 2,
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1746978863758',
                        x: 6,
                        y: 2,
                        w: 3,
                        h: 14,
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1747075557335',
                        x: 0,
                        y: 17,
                        w: 12,
                        h: 2,
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1747137570401',
                        x: 0,
                        y: 6,
                        w: 6,
                        h: 10,
                        moved: false,
                        static: false
                    }
                ]
            }}
            breakpoints={{ lg: 1200 }} // Ширина экрана для переключения
            cols={{ lg: 12 }} // Количество колонок для каждого размера
            rowHeight={20}
            compactType={null} // Отключение автоматической компоновки
            preventCollision={true}
            isDraggable={false}
            isResizable={false}
            margin={[5, 5]}
        >
            <div
                key={'cell-1746978848104'}
                style={{
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}
            >
                {cell_1746978848104()}
            </div>

            <div
                key={'cell-1746978852542'}
                style={{
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}
            >
                {cell_1746978852542()}
            </div>

            <div
                key={'cell-1746978863758'}
                style={{
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}
            >
                {cell_1746978863758()}
            </div>

            <div
                key={'cell-1747137570401'}
                style={{
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}
            >
                {cell_1747137570401()}
            </div>
        </ResponsiveGridLayout>
    );
}
