import cell_1746527949939 from './cell-1746527949939.tsx';
import cell_1747227523825 from './cell-1747227523825.tsx';
import cell_1747227526997 from './cell-1747227526997.tsx';
import cell_1747227527273 from './cell-1747227527273.tsx';
import cell_1747750856603 from './cell-1747750856603.tsx';
import cell_1747755864668 from './cell-1747755864668.tsx';
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
                        i: 'cell-1746527949939',
                        x: 0,
                        y: 0,
                        w: 5,
                        h: 25,
                        moved: false,
                        static: false,
                        props: { style: {}, classNames: '' }
                    },
                    {
                        i: 'cell-1747227523825',
                        x: 5,
                        y: 0,
                        w: 3,
                        h: 11,
                        moved: false,
                        static: false,
                        props: { style: {}, classNames: '' }
                    },
                    {
                        i: 'cell-1747227526997',
                        x: 8,
                        y: 0,
                        w: 4,
                        h: 11,
                        moved: false,
                        static: false,
                        props: { style: {}, classNames: '' }
                    },
                    {
                        i: 'cell-1747227527273',
                        x: 5,
                        y: 11,
                        w: 3,
                        h: 21,
                        moved: false,
                        static: false,
                        props: { style: {}, classNames: '' }
                    },
                    {
                        i: 'cell-1747750856603',
                        x: 8,
                        y: 11,
                        w: 4,
                        h: 9,
                        props: { classNames: '', style: {} },
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1747755864668',
                        x: 8,
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

            <div
                key={'cell-1747227527273'}
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
                {cell_1747227527273()}
            </div>

            <div
                key={'cell-1747750856603'}
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
                {cell_1747750856603()}
            </div>

            <div
                key={'cell-1747755864668'}
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
                {cell_1747755864668()}
            </div>
        </ResponsiveGridLayout>
    );
}
