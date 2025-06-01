////////////////////////////////////////////////////////////////////////////////////////////////////
//          headles render function
////////////////////////////////////////////////////////////////////////////////////////////////////
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


export function generateLiteralFromCells(virtualResults: Record<string, string[]>) {
    const allImports = new Set();
    const allFunctions: string[] = [];
    const seenIds = new Set<number>();
    const nameCounter: Record<string, number> = {};
    const jsxByCell: Record<string, string> = {};


    for (const [key, componentCodes] of Object.entries(virtualResults)) {
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
                    // ⛔ дубликат по id — скипаем
                    if (seenIds.has(usedId)) continue;
                    else  seenIds.add(usedId);
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

        jsxByCell[key] = jsxLines.join('\n');
    }

    return {
        allImports,
        allFunctions,
        nameCounter,
        seenIds,
        jsxByCell
    }
}
export function generateRenderGridFileSafe(
    virtualResults: Record<string, string[]>,
    layouts: { i: string; [key: string]: any }[]
): string {
    const {allImports, allFunctions, jsxByCell} = generateLiteralFromCells(virtualResults);
   

    const cellJSX = layouts.map((layer)=> {
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
                ${ jsxByCell[layer.i] ?? '' }
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