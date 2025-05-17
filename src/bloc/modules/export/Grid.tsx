import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import type { File } from '@babel/types';
import { LayoutCustom } from '../../type';
import { exportLiteralToFile } from "../../utils/export";
import { Component } from '../../type';


export function mergeImports(importLines: string[]): string[] {
    const importMap: Record<string, Set<string>> = {};
    const defaultImports: Record<string, string> = {};

    for (const line of importLines) {
        const match = line.match(/^import\s+(.*)\s+from\s+['"]([^'"]+)['"]/);
        if (!match) continue;

        const importsPart = match[1].trim();
        const source = match[2];

        // default import: import X from 'lib'
        if (!importsPart.startsWith('{')) {
            const [defImport, rest] = importsPart.split(',').map(s => s.trim());
            if (defImport) defaultImports[source] = defImport;
            if (rest?.startsWith('{')) {
                const names = rest.replace(/[{}]/g, '').split(',').map(s => s.trim());
                if (!importMap[source]) importMap[source] = new Set();
                names.forEach((name) => importMap[source].add(name));
            }
        } else {
            // named imports only
            const names = importsPart.replace(/[{}]/g, '').split(',').map(s => s.trim());
            if (!importMap[source]) importMap[source] = new Set();
            names.forEach((name) => importMap[source].add(name));
        }
    }

    // Сборка итоговых строк
    const result: string[] = [];

    const allSources = new Set([...Object.keys(importMap), ...Object.keys(defaultImports)]);
    for (const source of allSources) {
        const named = importMap[source] ? Array.from(importMap[source]).sort() : [];
        const defaultImport = defaultImports[source];

        if (defaultImport && named.length > 0) {
            result.push(`import ${defaultImport}, { ${named.join(', ')} } from '${source}';`);
        } else if (defaultImport) {
            result.push(`import ${defaultImport} from '${source}';`);
        } else if (named.length > 0) {
            result.push(`import { ${named.join(', ')} } from '${source}';`);
        }
    }

    return result;
}
function toValidVariableName(input: string): string {
    const replaced = input.replace(/[^a-zA-Z0-9_$]/g, '_'); // заменим все невалидные символы
    const prefixed = replaced.match(/^[0-9]/) ? '_' + replaced : replaced; // если начинается с цифры — добавим _
    return prefixed;
}
function objectArrayToJsLiteralWithoutContent(arr: object[], indent = 4): string {
    const space = ' '.repeat(indent);

    return `[\n` + arr.map(obj => {
        const entries = Object.entries(obj)
            .filter(([key]) => key !== 'content') // ❌ исключаем `content`
            .map(([key, value]) => {
                const valStr = JSON.stringify(value);
                return `${space}${key}: ${valStr}`;
            }).join(',\n');

        return `${space}{\n${entries}\n${space}}`;
    }).join(',\n') + `\n]`;
}
// разделка на импорт и jsx тело
export const splitImportsAndBody = (code: string) => {
    const lines = code.trim().split('\n');

    const importLines: string[] = [];
    const bodyLines: string[] = [];
    let inImports = true;

    for (const line of lines) {
        if (inImports && line.trim().startsWith('import')) {
            importLines.push(line.trim());
        }
        else {
            inImports = false;
            bodyLines.push(line);
        }
    }

    return {
        imports: importLines, // массив строк
        body: bodyLines.join('\n') // остальная часть кода как строка
    };
}
// ANCHOR может в next js не срабатывать
export function getComponentLiteral(code: string): string {
    let ast: File;

    try {
        ast = parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });
    } 
    catch (err) {
        console.error('Babel parse error:', err);
        return code.trim(); // если код некорректный — вернём как есть
    }

    let found = false;
    let jsxCode = '';

    traverse(ast, {
        ReturnStatement(path) {
            const arg = path.node.argument;
            if (arg) {
                const output = generate(arg, { retainLines: false });
                jsxCode = output.code;
                found = true;
                path.stop();
            }
        }
    });

    return found ? jsxCode.trim() : code.trim();
}


//! 'этот фундамент надо превратить в дом'
export default function exportsGrid(
    render: LayoutCustom[],
    scope: string,
    name: string,
    isSlot?: boolean,
    style?: React.CSSProperties,
) {
    const singleList = ['Breadcrumbs', 'AppBar'];
    const individualList = ['Tabs', 'BottomNav'];
    
    const renderComponents = async(content: Component[], cell: LayoutCustom) => {
        const imports: string[] = [];
        const bodysInOrder: string[] = [];
        const singletonsimports: string[] = [];
        const singletonsbody: string[] = [];
        const individualFunctions: string[] = [];
        let individualCounter = 0;

        await Promise.all(content.map((component) => {
            return new Promise<void>((resolve) => {
                const id = component.props['data-id'];
                const type = component.props['data-type'];

                // ANCHOR - вызов дегидратации у всех компонентов
                sharedEmmiter.emit('degidratation.' + id, {
                    call: (code: string) => {
                        const result = splitImportsAndBody(code);

                        if (singleList.includes(type)) {
                            singletonsbody.push(result.body);
                            singletonsimports.push(...result.imports);
                        } 
                        else if (individualList.includes(type)) {
                            const match = result.body.match(/export\s+default\s+function\s+([a-zA-Z0-9_$]+)\s*\(/);

                            if (match) {
                                const baseName = match[1];
                                const funcName = (content.filter(c => c.props['data-type'] === type).length === 1)
                                    ? baseName
                                    : baseName + individualCounter++;

                                // заменяем export default → export function ...
                                const funcCode = result.body.replace(
                                    /export\s+default\s+function\s+([a-zA-Z0-9_$]+)\s*\(/,
                                    `export function ${funcName}(`
                                );

                                individualFunctions.push(funcCode);
                                bodysInOrder.push(`<${funcName} />`);
                                imports.push(...result.imports);
                            }
                        }
                        else {
                            bodysInOrder.push(getComponentLiteral(result.body));
                            imports.push(...result.imports);
                        }
                        resolve(); // обязательно!
                    }
                });
            });
        }));

        const unicalImportsArray = mergeImports(imports);

        return {
            singletons: singletonsbody.length > 0 ? {
                imports: mergeImports(singletonsimports),
                body: singletonsbody,
            } : undefined,
            cells: bodysInOrder.length > 0 ? `
                ${unicalImportsArray.join('\n')}

                ${individualFunctions.join('\n\n')}

                export default function Cell() {
                    return(
                        <>
                            ${bodysInOrder.join('\n\n')}
                        </>
                    );
                }
            ` : undefined
        }
    }
    const renderLiteralLayouts = async() => {
        const results: Record<string, string> = {};

        await Promise.all(
            render.map(async (layout) => {
                if (!Array.isArray(layout.content)) return;

                const content = layout.content;
                const cellid = layout.i;
                const result = await renderComponents(content, layout);

                if (result.cells) {
                    const path = await exportLiteralToFile([scope, name], cellid, result.cells);
                    results[cellid] = path;
                }
                if (result.singletons) {
                    const sharedPath = await exportLiteralToFile(
                        [scope, 'shared'],
                        cellid,
                        `
                            ${result.singletons.imports.join('\n')}

                            ${result.singletons.body.join('\n\n')}
                        `
                    );
                    results[cellid] = sharedPath;
                }
            })
        );

        const paths = Object.keys(results).map((cellId)=> {
            const paths = results[cellId];
            const nameVar = toValidVariableName(cellId);
            return {
                import: paths.includes('/shared') ? `import ${nameVar} from "..${paths}"` : `import ${nameVar} from "./${cellId}.tsx"`,
                nameVar,
                cellId: cellId
            }
        });
        

        let imports = ``;
        let cells = ``;
        render.map((layout, index) => {
            const find = paths.find((elem)=> elem.cellId === layout.i);
            if(find) {
                imports = imports+'\n'+find.import;
                cells = cells + '\n' + `
                    <div
                        key={"${find.cellId}"}
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
                        { ${find.nameVar}() }
                    </div>
                `
            }
        });

        return {
            imports,
            cells
        }
    }
    const renderLiteralGrid = async()=> {
        const result = await renderLiteralLayouts();
        const layersLiteral = objectArrayToJsLiteralWithoutContent(render);
        

        const literal = (`
            ${result.imports}
            import React from 'react';
            import { Responsive, WidthProvider } from "react-grid-layout";

            const ResponsiveGridLayout = WidthProvider(Responsive);

            export default function RenderGrid() {
                return (
                    <ResponsiveGridLayout
                        style={{ }}
                        className="GRID-EDITOR"
                        layouts={{ lg: ${layersLiteral} }}                                          
                        breakpoints={{ lg: 1200 }}                                  // Ширина экрана для переключения
                        cols={{ lg: 12 }}                                           // Количество колонок для каждого размера
                        rowHeight={20}
                        compactType={null}                                          // Отключение автоматической компоновки
                        preventCollision={true}
                        isDraggable={false}             
                        isResizable={false}             
                        margin={[5, 5]}
                    >
                        ${result.cells}
                    </ResponsiveGridLayout>
                );
            }
        `);
        
        exportLiteralToFile([scope, name], 'index', literal);
    }

   
    renderLiteralGrid();
}




/**
 *  const getComponentLiteral = (code: string) => {
        const match = code.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
        const extractedJSX = match?.[1]?.trim();

        return extractedJSX ?? code;
    }
 */