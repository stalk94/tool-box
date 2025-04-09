import React from "react";
import { Button, useTheme } from "@mui/material";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "../../style/grid.css"


type LayoutCustom = Layout & {
    /** id рендер элемента */
    content?: number
}
type GridEditorProps = {
    layout: LayoutCustom[]
    renderItems: React.ReactNode[]
}

const ResponsiveGridLayout = WidthProvider(Responsive);


// попытка создать дегидратор
export default function ({ layout, renderItems}: GridEditorProps) {
    const theme = useTheme();
    const [current, setCurrent] = React.useState<string | undefined>();
    const [margin, setMargin] = React.useState<[number, number]>([0, 0]);
   

    const handleItemClick = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setCurrent(id);
    }


    return(
        <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768 }}         // Ширина экрана для переключения
            cols={{ lg: 12, md: 12, sm: 12 }}                    // Количество колонок для каждого размера
            rowHeight={30}
            margin={margin}
            isDraggable={false}
            isResizable={false}
        >
            {layout.map((item, index) => (
                <div className="react-grid-item"
                    key={item.i}
                    style={{
                        display: "flex",
                        justifyContent: 'center',
                        alignItems: "center",
                        flex: 1,
                        overflow: 'auto',
                    }}
                    onClick={(e) => handleItemClick(item.i, e)}
                >
                    {renderItems?.[item.content]?.render
                        ? renderItems[item.content].render()
                        : <div style={{ textAlign: 'center' }}>{`Block ${index}`}</div>
                    }
                </div>
            ))}
        </ResponsiveGridLayout>

    );
}