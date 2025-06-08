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
            data-parent="cell-1749331095342"
            variant="outlined"
            size="medium"
            color="primary"
            fullWidth
            data-type="Button"
            onClick={() =>
                sharedEmmiter.emit('event', {
                    id: 1749331097905,
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
                        i: 'cell-1749331095342',
                        x: 0,
                        y: 0,
                        w: 12,
                        h: 8,
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
                key="cell-1749331095342"
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
