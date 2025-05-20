import React from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { LayoutCustom, ComponentSerrialize } from '../type';
import { desserealize } from '../helpers/sanitize';
import { Input } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { generateRenderGridFileSafe } from './shim';


type MiniRenderSlotProps = {
    layouts: LayoutCustom[]
    size: {
        width: number 
        height: number 
    }
    onClick: ()=> void
    onReadyLiteral: (code: string)=> void
}
const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];



export default function MiniRender({ layouts, size, onClick, onReadyLiteral }: MiniRenderSlotProps) {
    // режим headles render
    const degidrateAll = async () => {
        const cacheIds = [];
        const resultCellsRender: Record<string, string[]> = {};

        await Promise.all(layouts.map(async (cell) => {
            const cellResults: string[] = [];

            if (!Array.isArray(cell.content)) return;

            await Promise.all(cell.content.map((comp) => {
                return new Promise<void>((resolve) => {
                    const id = comp.props['data-id'];

                    sharedEmmiter.emit('degidratation.' + id, {
                        call: (code: string) => {
                            if(!cacheIds.includes(id)) {
                                cellResults.push(code);
                                cacheIds.push(id);
                            }
                            resolve();
                        }
                    });
                });
            }));

            resultCellsRender[cell.i] = cellResults;
        }));

        const fileCode = generateRenderGridFileSafe(resultCellsRender, layouts);
        onReadyLiteral(fileCode);
    }
    React.useEffect(()=> {
        if(onReadyLiteral) degidrateAll();
    }, []);


    return(
        <div style={{position: 'relative'}}>
        {!onReadyLiteral &&
            <div style={{position: 'absolute', zIndex: 999, left:'45%', top: '30%' }}>
                <IconButton onClick={onClick}>
                    <Input style={{fontSize: 24}} />
                </IconButton>
            </div>
        }
        <ResponsiveGridLayout
            style={{ 
                background: '#222222', 
                width: size?.width
            }}
            className="GRID-SLOT"
            layouts={{ lg: layouts ?? [] }}                                   // Схема сетки
            breakpoints={{ lg: 1200 }}                                  // Ширина экрана для переключения
            cols={{ lg: 12 }}                                           // Количество колонок для каждого размера
            rowHeight={20}
            compactType={null}                                          // Отключение автоматической компоновки
            preventCollision={true}
            isDraggable={false}                                         // Отключить перетаскивание
            isResizable={false}                                         // Отключить изменение размера
            margin={margin}
        >
            { layouts && layouts?.map((layer) => {
                return (
                    <div
                        data-id={layer.i}
                        key={layer.i}
                        className={layer?.props?.classNames}
                        style={{
                            ...layer?.props?.style,
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
                        { Array.isArray(layer.content) &&
                            layer.content.map((component, index) =>
                                <React.Fragment key={index}>
                                    { desserealize(component) }
                                </React.Fragment>
                            )
                        }
                    </div>
                );
            })}
        </ResponsiveGridLayout>
        </div>
    );
}
