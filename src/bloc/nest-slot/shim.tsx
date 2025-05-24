import React from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { Power, LinkOff, Add, Remove } from '@mui/icons-material';
import { serializeJSX } from '../helpers/sanitize';
import { editorSlice, infoSlice, renderSlice, cellsSlice } from "./context";


export function updateComponentProps({ component, data, rerender = true }) {
    const id = component?.props?.['data-id'];
    const cellId = editorSlice.currentCell.get()?.i;

    if (!id || !cellId) {
        console.warn('updateComponentProps: отсутствует data-id или data-cell');
        return;
    }
    
    cellsSlice.set((old) => {
        const index = old[cellId]?.findIndex((c) => c.id === id);

        if (index !== -1) {
            Object.entries(data).forEach(([key, value]) => {
                old[cellId][index].props[key] = value;
            });
        }
        return old;
    });

    // 🔁 Обновляем визуальный рендер через context.render
    if (rerender) renderSlice.set((layers) => {
        console.log('update props: ', component, data);
        
        const updated = layers.map((layer) => {
            if (!Array.isArray(layer.content)) return layer;
            
            const i = layer.content.findIndex((c) => c?.props?.['data-id'] === id);

            if (i === -1) return layer;
            const current = layer.content[i];
            
            if (!current) {
                console.warn('updateComponentProps: компонент не найден в render');
                return layer;
            }

            try {
                const updatedComponent = React.cloneElement(current, {
                    ...current.props,
                    ...data,
                });

                infoSlice.select?.content?.set(updatedComponent);         // fix
                layer.content[i] = updatedComponent;
               
                editorSlice.layout.set((old)=> 
                    old.map((l)=> {
                        if(l.i === layer.i) l.content[i] = updatedComponent;
                        return l;
                    })
                );
            } 
            catch (e) {
                console.error('❌ Ошибка при клонировании компонента:', e, current);
            }

            return layer;
        });

        layers = [...updated];
    });
}



////////////////////////////////////////////////////////////
//          shim add slot
////////////////////////////////////////////////////////////
const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
    options,
    align = 'top',
    offsetY = -30,
    visible = true,
    position = 'right',
    sx
}) => {
    if (!visible) return null;
    const [widths, setWidth] = React.useState(40);
    let justifyContent: 'flex-start' | 'center' | 'flex-end' = 'center';
    if (position === 'left') justifyContent = 'flex-start';
    if (position === 'right') justifyContent = 'flex-end';

    const f =()=> {
        if(widths < 50) return [options.at?.(-1)];
        else return options;
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                [align]: offsetY,
                [position]: 0, 
                display: 'flex',
                justifyContent,
                gap: 0.5, 
                flexDirection: 'row',  
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(82, 82, 82, 0.901)',
                border: '1px solid rgba(239, 238, 236, 0.627)',
                boxShadow: `
                    0px 2px 4px 0px rgba(0, 0, 0, 0.3),
                    0px 1px 4px 0px rgba(0, 0, 0, 0.54)`,
                zIndex: 999,
                pointerEvents: 'auto',
                ...sx,
                width: widths,
            }}
            onMouseEnter={()=> setWidth(sx?.width)}
            onMouseLeave={()=> setWidth(40)}
            style={{padding: '6px'}}
            onClick={(e) => e.stopPropagation()}
        >
            { f().map((opt, i) => (
                <IconButton
                    key={i}
                    size="small"
                    onClick={opt.action}
                    sx={{ color: '#ccc', fontSize: 14,mr:-0.5 }}
                >
                    { opt.icon }
                </IconButton>
            ))}
        </Box>
    );
}
export const SlotToolBar =({ dataId, type, item })=> {
    const [isThisSelect, setSelectThis] = React.useState(false);
    const selectContent = infoSlice.select.content;
    

    if(type !== 'Accordion' && type !== 'Tabs' &&  type !== 'BottomNav') return;
    const getOptions = () => {
        const getNewValue =(selectedProps)=> {
            if (type === 'Tabs') return `link-${selectedProps.items.length}`;
            else if(type === 'BottomNav') return {
                icon: 'Settings',
                label: 'test'
            }
            else return {
                title: serializeJSX(<Box sx={{ ml: 1.5 }}>・test-{selectedProps.items.length}</Box>),
                content: serializeJSX(<Box sx={{ m: 3 }}>content</Box>)
            }
        }

        return [
            {
                action: () => {
                    const selectedProps = selectContent.get()?.props;

                    updateComponentProps({
                        component: { props: selectedProps },
                        data: { items: selectedProps.items.slice(0, -1) }
                    })
                },
                icon: <Remove sx={{ color: '' }} />
            },
            {
                action: () => {
                    const selectedProps = selectContent.get()?.props;
                    const newItem = getNewValue(selectedProps);

                    updateComponentProps({
                        component: { props: selectedProps },
                        data: { items: [...selectedProps.items, newItem] }
                    })
                },
                icon: <Add sx={{ color: '' }} />
            },
        ];
    }
    React.useEffect(()=> {
        const cur = selectContent.get();

        if(cur) {
            const selectDataId = cur?.props['data-id'];
            if(selectDataId === dataId) setSelectThis(true);
            else setSelectThis(false);
        }
    }, [selectContent])


    return(
        <ContextualToolbar
            visible={isThisSelect}
            options={getOptions()}
            align='top'
            offsetY={0}
            sx={{width: 80, height: 30}}
        />
    );
}


////////////////////////////////////////////////////////////
//          headles render function
////////////////////////////////////////////////////////////
// зачистка от дубликатов
function dedupeImports(lines: string[]): string[] {
    const importMap: Record<string, Set<string>> = {};
    const otherLines: string[] = [];

    for (const rawLine of lines) {
        const line = rawLine.trim();
        const importNamedMatch = line.match(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/);

        if (importNamedMatch) {
            const components = importNamedMatch[1].split(',').map(c => c.trim());
            const source = importNamedMatch[2];
            if (!importMap[source]) {
                importMap[source] = new Set();
            }
            components.forEach(c => importMap[source].add(c));
        } else if (line.startsWith('import')) {
            // не named импорт, сохраняем как есть
            otherLines.push(rawLine.trim());
        } else {
            otherLines.push(rawLine); // не импорт
        }
    }

    const result: string[] = [];

    // Добавляем сначала обычные импорты без named
    const uniqueOtherLines = [...new Set(otherLines)];
    result.push(...uniqueOtherLines);

    // Добавляем объединённые named импорты
    for (const [source, components] of Object.entries(importMap)) {
        const sorted = Array.from(components).sort().join(', ');
        result.push(`import { ${sorted} } from '${source}';`);
    }

    return result;
}

export function generateRenderGridFileSafe(
    virtualResults: Record<string, string[]>,
    layouts: { i: string; [key: string]: any }[]
): string {
    const allImports = new Set();
    const allFunctions: string[] = [];
    const jsxByCell: Record<string, string> = {};
    const nameCounter: Record<string, number> = {};
    const seenIds = new Set<number>();

    for (const [cellId, componentCodes] of Object.entries(virtualResults)) {
        const jsxLines: string[] = [];

        for (const code of componentCodes) {
        const lines = code.trim().split('\n');
        const importLines = lines.filter(line => line.trim().startsWith('import'));
        const bodyLines = lines.filter(line => !line.trim().startsWith('import'));
        const fullBody = bodyLines.join('\n').trim();

        importLines.forEach(line => allImports.add(line));
        const match = fullBody.match(/export default function (\w+)/);

        if (match) {
            const baseName = match[1];
            const count = nameCounter[baseName] ?? 0;
            const uniqueName = count === 0 ? baseName : `${baseName}_${count}`;
            nameCounter[baseName] = count + 1;

            // 🧠 Попытка вытащить id
            const idMatch = fullBody.match(/id:\s*(\d+)/);
            const usedId = idMatch ? parseInt(idMatch[1], 10) : undefined;

            if (usedId !== undefined) {
                if (seenIds.has(usedId)) {
                    continue; // ⛔ дубликат по id — скипаем
                } else {
                    seenIds.add(usedId);
                }
            }

            const replaced = fullBody.replace(
                `export default function ${baseName}`,
                `export function ${uniqueName}`
            );

            allFunctions.push(replaced);
            jsxLines.push(`<${uniqueName} />`);
        } 
        else if (fullBody.startsWith('<')) {
            // ⛔ в JSX нет onClick → не обрабатываем сейчас
            jsxLines.push('/*! unsupported raw JSX */');
        } 
        else {
            jsxLines.push('/*! unsupported component */');
        }
    }

        jsxByCell[cellId] = jsxLines.join('\n');
    }
   
    const cellJSX = layouts.map(layer => {
        const jsx = jsxByCell[layer.i] ?? '';
        return `            <div
                key="${layer.i}"
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
                ${jsx}
            </div>`;
    }).join('\n');

    const layoutLite = layouts.map(({ content, ...rest }) => rest);
    

    return `
        import { Responsive, WidthProvider } from 'react-grid-layout';
        ${ dedupeImports([...allImports]).join('\n') }

        const ResponsiveGridLayout = WidthProvider(Responsive);


        ${allFunctions.join('\n\n')}



        export default function RenderGrid() {
            return (
                <ResponsiveGridLayout
                    className="GRID-EDITOR"
                    layouts={{ lg: ${JSON.stringify(layoutLite, null, 4)} }}
                    breakpoints={{ lg: 1200 }}
                    cols={{ lg: 12 }}
                    rowHeight={20}
                    compactType={null}
                    preventCollision={true}
                    isDraggable={false}
                    isResizable={false}
                    margin={[5, 5]}
                >
                    ${cellJSX}
                </ResponsiveGridLayout>
            );
        }
        `.trim();
}