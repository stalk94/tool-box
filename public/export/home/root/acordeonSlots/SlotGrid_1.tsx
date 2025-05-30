import { Responsive, WidthProvider } from 'react-grid-layout';
import React from 'react';
import { Typography } from '@mui/material';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function TypographyWrap() {
    return (
        <Typography
            sx={{
                width: '100%',
                display: 'block',
                textAlign: 'center',
                fontSize: 'undefinedpx'
            }}
            style={{ display: 'flex', justifyContent: 'center' }}
            variant="subtitle1"
            data-type="Typography"
        >
            Заголовок
        </Typography>
    );
}

export default function RenderGrid() {
    return (
        <ResponsiveGridLayout
            className="GRID-EDITOR"
            layouts={{
                lg: [
                    {
                        i: 'cell-1747706281576',
                        x: 0,
                        y: 0,
                        w: 12,
                        h: 5,
                        props: {
                            classNames: '',
                            style: {}
                        },
                        moved: false,
                        static: false
                    }
                ]
            }}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 12 }}
            rowHeight={20}
            compactType={null}
            preventCollision={true}
            isDraggable={false}
            isResizable={false}
            margin={[5, 5]}
        >
            <div
                key="cell-1747706281576"
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
                <TypographyWrap />
            </div>
        </ResponsiveGridLayout>
    );
}
