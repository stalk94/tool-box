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
                    id: 1747872571305,
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
            Заголовок
        </Typography>
    );
}

export function ButtonWrap_1() {
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
                    id: 1747872573332,
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
                        i: 'cell-1747872564171',
                        x: 0,
                        y: 0,
                        w: 12,
                        h: 2,
                        props: {
                            classNames: '',
                            style: {}
                        },
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1747872565778',
                        x: 0,
                        y: 2,
                        w: 12,
                        h: 2,
                        props: {
                            classNames: '',
                            style: {}
                        },
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1747872566463',
                        x: 0,
                        y: 4,
                        w: 12,
                        h: 2,
                        props: {
                            classNames: '',
                            style: {}
                        },
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1747872567621',
                        x: 0,
                        y: 6,
                        w: 4,
                        h: 2,
                        props: {
                            classNames: '',
                            style: {}
                        },
                        moved: false,
                        static: false
                    },
                    {
                        i: 'cell-1747872568546',
                        x: 4,
                        y: 6,
                        w: 4,
                        h: 2,
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
                key="cell-1747872564171"
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
            <div
                key="cell-1747872565778"
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
            <div
                key="cell-1747872566463"
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
                <ButtonWrap_1 />
            </div>
            <div
                key="cell-1747872567621"
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
            ></div>
            <div
                key="cell-1747872568546"
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
            ></div>
        </ResponsiveGridLayout>
    );
}
