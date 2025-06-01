import cell_1746709723197 from './cell-1746709723197.tsx';
import cell_1747763221272 from './cell-1747763221272.tsx';
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
                        i: 'cell-1746709723197',
                        x: 0,
                        y: 0,
                        w: 5,
                        h: 24,
                        moved: false,
                        static: false,
                        props: { style: {}, classNames: '' }
                    },
                    {
                        i: 'cell-1747763221272',
                        x: 5,
                        y: 0,
                        w: 7,
                        h: 24,
                        props: { classNames: '', style: {} },
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
                key={'cell-1746709723197'}
                style={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    height: '100%',
                    display: 'inline-flex',
                    width: '100%',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    alignContent: 'flex-start'
                }}
            >
                {cell_1746709723197()}
            </div>

            <div
                key={'cell-1747763221272'}
                style={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    height: '100%',
                    display: 'inline-flex',
                    width: '100%',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    alignContent: 'flex-start'
                }}
            >
                {cell_1747763221272()}
            </div>
        </ResponsiveGridLayout>
    );
}
