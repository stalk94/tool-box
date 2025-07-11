import React from "react";
import { LayoutCustom, ComponentSerrialize, Breakpoint } from '../type';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Responsive, WidthProvider } from "react-grid-layout";
import { desserealize } from '../helpers/sanitize';
import { useTheme } from '@mui/material/styles';
import registr from '../helpers/shared';
const ResponsiveGridLayout = WidthProvider(Responsive);

type RenderProps = { 
    layouts: Record<Breakpoint, LayoutCustom[]>
    cells: Record<string, ComponentSerrialize[]>
    size: any
    meta?: {
        rowHeight: number
        margin: [number, number]
    }
    preview?: boolean
}

// height: size.height - 10,
function Render({ layouts, cells, size, meta, preview }: RenderProps) {
    const theme = useTheme();
    const [currentBreakpoint, setCurrentBreackpoint] = React.useState('lg');
    const currentLayout = React.useMemo(() => layouts[currentBreakpoint], [currentBreakpoint, layouts]);

    
    const useElevation = (elevation: number) => {
        const safeElevation = Math.min(Math.max(elevation, 0), 24);
        return theme.shadows[safeElevation];
    }
    const initBlock = React.useCallback((
        cell: LayoutCustom, 
        content: ComponentSerrialize[]|ComponentSerrialize[][]
    ) => {
        const nameGroup = cell?.props?.["data-group"] ?? cell.i;
        registr.init(nameGroup, cell);          // инициализация блоков и их компонентов

        if (Array.isArray(content) && Array.isArray(content[0])) {
            return content.map((contentNested)=> registr.inject(contentNested, cell))
        }
        else {
            return registr.inject(content, cell);
        }
    }, [currentLayout]);
    

    return (
        <ResponsiveGridLayout
            style={{ minWidth: '100%' }}
            layouts={{ [currentBreakpoint]: currentLayout }}
            breakpoints={{ lg: 1200, md: 980, sm: 640, xs: 480 }}
            cols={{ lg: 24, md: 16, sm: 12, xs: 8 }}
            rowHeight={(meta?.rowHeight ?? 13)}        
            margin={meta?.margin ?? [0, 0]}           
            isDraggable={false}
            isResizable={false}
            compactType={null}
            onBreakpointChange={(br) => setCurrentBreackpoint(br)}
        >
            {currentLayout.map((layer) => {
                const content = preview ? cells[layer.i] : initBlock(layer, cells[layer.i]);
                const splitCells = layer.props?.nested;

                return (
                    <div
                        data-id={layer.i}
                        key={layer.i}
                        className={layer?.props?.classNames}
                        style={{
                            background: 'none',
                            boxShadow: useElevation(layer?.props?.elevation ?? 0),
                            ...layer?.props?.style,
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            height: '100%',
                            display: 'inline-flex',
                            width: '100%',
                            flexWrap: 'wrap',
                            alignItems: 'stretch',
                            alignContent: 'flex-start',
                            boxSizing: 'border-box',
                        }}
                    >
                        {Array.isArray(content) && splitCells &&
                            <Splitter key={layer.i}
                                style={{ height: '100%', width: '100%' }}
                                layout={splitCells.orientation}
                            >
                                {content.map((components, index) =>
                                    <SplitterPanel
                                        key={index}
                                        size={splitCells.sizes[index] ?? 50}
                                        style={{marginLeft: 'auto'}}
                                    >
                                        {components.map((component)=>
                                            <div
                                                key={component.props['data-id']}
                                                style={{
                                                    boxSizing: 'border-box',
                                                    position: 'relative',
                                                    width: component.props.fullWidth ? '100%' : (component.props.width ?? 300),
                                                    display: 'flex',
                                                    transformOrigin: 'center',
                                                    flexShrink: 0,
                                                    flexBasis: component.props.fullWidth ? '100%' : (component.props.width ?? 30),
                                                    maxWidth: '100%',
                                                    padding: 1,
                                                }}
                                            >
                                                { desserealize(component) }
                                            </div>
                                        )}
                                    </SplitterPanel>
                                )}
                            </Splitter>
                        }
                        {!splitCells &&
                            <>
                            {content.map((component)=>
                                 <div
                                    key={component.props['data-id']}
                                    style={{
                                        boxSizing: 'border-box',
                                        position: 'relative',
                                        width: component.props.fullWidth ? '100%' : (component.props.width ?? 300),
                                        display: 'flex',
                                        transformOrigin: 'center',
                                        flexShrink: 0,
                                        flexBasis: component.props.fullWidth ? '100%' : (component.props.width ?? 30),
                                        maxWidth: '100%',
                                        padding: 1,
                                    }}
                                >
                                    { desserealize(component) }
                                </div>
                            )}
                            </>
                        }
                    </div>
                );
            })}
        </ResponsiveGridLayout>
    );
}


export default React.memo(Render);