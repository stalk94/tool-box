import cell_1746527949939 from './cell-1746527949939.tsx';
import cell_1747227523825 from './cell-1747227523825.tsx';
import cell_1747227526997 from './cell-1747227526997.tsx';
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
                        w: 5,
                        h: 32,
                        x: 0,
                        y: 0,
                        i: 'cell-1746527949939',
                        minW: undefined,
                        maxW: undefined,
                        minH: undefined,
                        maxH: undefined,
                        moved: false,
                        static: false,
                        isDraggable: undefined,
                        isResizable: undefined,
                        resizeHandles: undefined,
                        isBounded: undefined
                    },
                    {
                        w: 3,
                        h: 11,
                        x: 5,
                        y: 0,
                        i: 'cell-1747227523825',
                        minW: undefined,
                        maxW: undefined,
                        minH: undefined,
                        maxH: undefined,
                        moved: false,
                        static: false,
                        isDraggable: undefined,
                        isResizable: undefined,
                        resizeHandles: undefined,
                        isBounded: undefined
                    },
                    {
                        w: 4,
                        h: 5,
                        x: 8,
                        y: 0,
                        i: 'cell-1747227526997',
                        minW: undefined,
                        maxW: undefined,
                        minH: undefined,
                        maxH: undefined,
                        moved: false,
                        static: false,
                        isDraggable: undefined,
                        isResizable: undefined,
                        resizeHandles: undefined,
                        isBounded: undefined
                    },
                    {
                        w: 3,
                        h: 21,
                        x: 5,
                        y: 11,
                        i: 'cell-1747227527273',
                        minW: undefined,
                        maxW: undefined,
                        minH: undefined,
                        maxH: undefined,
                        moved: false,
                        static: false,
                        isDraggable: undefined,
                        isResizable: undefined,
                        resizeHandles: undefined,
                        isBounded: undefined
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
                key={'cell-1746527949939'}
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
                {cell_1746527949939()}
            </div>

            <div
                key={'cell-1747227523825'}
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
                {cell_1747227523825()}
            </div>

            <div
                key={'cell-1747227526997'}
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
                {cell_1747227526997()}
            </div>
        </ResponsiveGridLayout>
    );
}
