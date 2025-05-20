import { Responsive, WidthProvider } from 'react-grid-layout';
import React from 'react';
import { Button, Typography } from '@mui/material';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function ButtonWrap() {
    return (
        <Button
            startIcon={undefined}
            endIcon={undefined}
            style={{}}
            variant="outlined"
            color="primary"
            fullWidth
            data-type="Button"
            onClick={() =>
                sharedEmmiter.emit('event', {
                    id: 1747679530434,
                    type: 'click'
                })
            }
        >
            Button
        </Button>
    );
}

export function ButtonWrap_1() {
    return (
        <Button
            startIcon={undefined}
            endIcon={undefined}
            style={{}}
            variant="outlined"
            color="success"
            fullWidth
            data-type="Button"
            onClick={() =>
                sharedEmmiter.emit('event', {
                    id: 1747680370700,
                    type: 'click'
                })
            }
        >
            Button
        </Button>
    );
}

export function ButtonWrap_2() {
    return (
        <Button
            startIcon={undefined}
            endIcon={undefined}
            style={{}}
            variant="outlined"
            color="error"
            fullWidth
            data-type="Button"
            onClick={() =>
                sharedEmmiter.emit('event', {
                    id: 1747683899363,
                    type: 'click'
                })
            }
        >
            Button
        </Button>
    );
}

export function TypographyWrap() {
    return (
        <Typography
            sx={{ width: '100%', display: 'block', fontSize: 'undefinedpx' }}
            style={{ display: 'flex' }}
            variant="h5"
            data-type="Typography"
        >
            Заголовокmm
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
                        i: 'cell-1747679527090',
                        x: 0,
                        y: 0,
                        w: 12,
                        h: 10,
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
                key="cell-1747679527090"
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
                <ButtonWrap_1 />
                <ButtonWrap_2 />
                <TypographyWrap />
            </div>
        </ResponsiveGridLayout>
    );
}
