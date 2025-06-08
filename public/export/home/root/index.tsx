import cell_1746527949939 from './cell-1746527949939.tsx';
import cell_1747227526997 from './cell-1747227526997.tsx';
import cell_1747227527273 from './cell-1747227527273.tsx';
import cell_1747750856603 from './cell-1747750856603.tsx';
import cell_1748696638444 from './cell-1748696638444.tsx';
import cell_1749131869369 from './cell-1749131869369.tsx';
import cell_1749312256845 from './cell-1749312256845.tsx';
import cell_1749325618003 from '../shared/cell-1749325618003.tsx';
import cell_1749326085236 from '../shared/cell-1749326085236.tsx';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function RenderGrid() {
    const [currentBreakpoint, setBreackpoint] = React.useState('lg');
    const layouts = {
        lg: [
            {
                w: 5,
                h: 17,
                x: 0,
                y: 7,
                i: 'cell-1746527949939',
                moved: false,
                static: false
            },
            {
                w: 4,
                h: 6,
                x: 8,
                y: 7,
                i: 'cell-1747227526997',
                moved: false,
                static: false
            },
            {
                w: 3,
                h: 16,
                x: 5,
                y: 15,
                i: 'cell-1747227527273',
                moved: false,
                static: false
            },
            {
                w: 4,
                h: 9,
                x: 8,
                y: 13,
                i: 'cell-1747750856603',
                moved: false,
                static: false
            },
            {
                w: 5,
                h: 7,
                x: 0,
                y: 24,
                i: 'cell-1748696638444',
                moved: false,
                static: false
            },
            {
                w: 3,
                h: 8,
                x: 5,
                y: 7,
                i: 'cell-1749131869369',
                moved: false,
                static: false
            },
            {
                w: 4,
                h: 9,
                x: 8,
                y: 22,
                i: 'cell-1749312256845',
                moved: false,
                static: false
            },
            {
                w: 12,
                h: 3,
                x: 0,
                y: 0,
                i: 'cell-1749325618003',
                moved: false,
                static: false
            },
            {
                w: 12,
                h: 2,
                x: 0,
                y: 3,
                i: 'cell-1749326085236',
                moved: false,
                static: false
            }
        ],
        md: [
            {
                w: 5,
                h: 17,
                x: 0,
                y: 4,
                i: 'cell-1746527949939',
                moved: false,
                static: false
            },
            {
                w: 5,
                h: 8,
                x: 5,
                y: 4,
                i: 'cell-1747227526997',
                moved: false,
                static: false
            },
            {
                w: 2,
                h: 16,
                x: 5,
                y: 12,
                i: 'cell-1747227527273',
                moved: false,
                static: false
            },
            {
                w: 3,
                h: 16,
                x: 7,
                y: 12,
                i: 'cell-1747750856603',
                moved: false,
                static: false
            },
            {
                w: 5,
                h: 7,
                x: 0,
                y: 21,
                i: 'cell-1748696638444',
                moved: false,
                static: false
            },
            {
                w: 10,
                h: 2,
                x: 0,
                y: 0,
                i: 'cell-1749325618003',
                moved: false,
                static: false
            },
            {
                w: 10,
                h: 2,
                x: 0,
                y: 2,
                i: 'cell-1749326085236',
                moved: false,
                static: false
            }
        ],
        sm: [
            {
                w: 6,
                h: 13,
                x: 0,
                y: 4,
                i: 'cell-1746527949939',
                moved: false,
                static: false
            },
            {
                w: 8,
                h: 10,
                x: 0,
                y: 17,
                i: 'cell-1747227526997',
                moved: false,
                static: false
            },
            {
                w: 2,
                h: 13,
                x: 6,
                y: 4,
                i: 'cell-1747227527273',
                moved: false,
                static: false
            },
            {
                w: 8,
                h: 5,
                x: 0,
                y: 27,
                i: 'cell-1747750856603',
                moved: false,
                static: false
            },
            {
                w: 8,
                h: 2,
                x: 0,
                y: 0,
                i: 'cell-1749325618003',
                moved: false,
                static: false
            },
            {
                w: 8,
                h: 2,
                x: 0,
                y: 2,
                i: 'cell-1749326085236',
                moved: false,
                static: false
            }
        ],
        xs: [
            {
                i: 'cell-1749325618003',
                x: 0,
                y: 0,
                w: 3,
                h: 2,
                props: { classNames: '', style: {} }
            },
            {
                i: 'cell-1749326085236',
                x: 0,
                y: 2,
                w: 3,
                h: 2,
                props: { classNames: '', style: {} }
            }
        ]
    };

    return (
        <ResponsiveGridLayout
            style={{}}
            className="GRID-EDITOR"
            layouts={{ [currentBreakpoint]: layouts[currentBreakpoint] }}
            breakpoints={{ lg: 1200, md: 950, sm: 590, xs: 480 }} // Ширина экрана для переключения
            cols={{ lg: 12, md: 10, sm: 8, xs: 6 }} // Количество колонок для каждого размера
            rowHeight={20}
            compactType={null} // Отключение автоматической компоновки
            preventCollision={true}
            isDraggable={false}
            isResizable={false}
            margin={[5, 5]}
            onBreakpointChange={br => setBreackpoint(br)}
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
                key={'cell-1748696638444'}
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
                {cell_1748696638444()}
            </div>

            <div
                key={'cell-1749131869369'}
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
                {cell_1749131869369()}
            </div>

            <div
                key={'cell-1749312256845'}
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
                {cell_1749312256845()}
            </div>

            <div
                key={'cell-1749325618003'}
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
                {cell_1749325618003()}
            </div>

            <div
                key={'cell-1749326085236'}
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
                {cell_1749326085236()}
            </div>
        </ResponsiveGridLayout>
    );
}
