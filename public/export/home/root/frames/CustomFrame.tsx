import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function RenderGrid() {
    return (
        <ResponsiveGridLayout
            className="GRID-EDITOR"
            layouts={{ lg: [] }}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 12 }}
            rowHeight={20}
            compactType={null}
            preventCollision={true}
            isDraggable={false}
            isResizable={false}
            margin={[5, 5]}
        ></ResponsiveGridLayout>
    );
}
