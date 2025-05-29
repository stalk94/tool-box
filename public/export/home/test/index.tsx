import cell_1748490985905 from './cell-1748490985905.tsx';
import cell_1748491021219 from './cell-1748491021219.tsx';
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
                        i: 'cell-1748490985905',
                        x: 0,
                        y: 4,
                        w: 5,
                        h: 16,
                        props: { classNames: '', style: {} },
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1748491021219',
                        x: 5,
                        y: 4,
                        w: 7,
                        h: 16,
                        props: { classNames: '', style: {} },
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1748491997153',
                        x: 4,
                        y: 20,
                        w: 4,
                        h: 12,
                        props: { classNames: '', style: {} },
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1748492001453',
                        x: 0,
                        y: 20,
                        w: 4,
                        h: 12,
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
                key={'cell-1748490985905'}
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
                {cell_1748490985905()}
            </div>

            <div
                key={'cell-1748491021219'}
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
                {cell_1748491021219()}
            </div>
        </ResponsiveGridLayout>
    );
}
