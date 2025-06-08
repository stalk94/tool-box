import { Responsive, WidthProvider } from 'react-grid-layout';
import React from 'react';
import { Button } from '@mui/material';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function ButtonWrap() {
    return (
        <Button
            startIcon={undefined}
            endIcon={undefined}
            style={{}}
            sx={{ whiteSpace: 'nowrap' }}
            data-parent="cell-1749320523387"
            variant="outlined"
            size="medium"
            color="success"
            fullWidth
            data-type="Button"
            onClick={() =>
                sharedEmmiter.emit('event', {
                    id: 1749320528103,
                    type: 'click'
                })
            }
        >
            Button
        </Button>
    );
}

export default function RenderGrid() {
    return (
        <ResponsiveGridLayout
            className="GRID-EDITOR"
            layouts={{
                lg: [
                    {
                        i: 'cell-1749320523387',
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
                key="cell-1749320523387"
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
                <ButtonWrap />
            </div>
        </ResponsiveGridLayout>
    );
}
