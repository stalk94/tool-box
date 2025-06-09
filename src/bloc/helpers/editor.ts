import { ComponentSerrialize, LayoutCustom, Breakpoint } from '../type';
import { cellsSlice, editorContext } from "../context";



export function getComponentById(idToFind: number): ComponentSerrialize | undefined {
    const rawCache = cellsSlice.get();

    for (const layerKey in rawCache) {
        const list = rawCache[layerKey];
        const found = list.find((obj) => obj.id === idToFind);
        if (found) return found;
    }

    return undefined;
}
export function getUniqueBlockName(baseName: string, existingNames: string[]): string {
    let name = baseName;
    let counter = 1;

    while (existingNames.includes(name)) {
        name = `${baseName}_${counter}`;
        counter++;
    }

    return name;
}
export function getNearestLayout(current: Breakpoint, layouts: Record<Breakpoint, LayoutCustom[]>): LayoutCustom[] | undefined {
    const breakpointOrder: Breakpoint[] = ['lg', 'md', 'sm', 'xs'];
    if (layouts?.[current]?.[0]) return layouts[current];

    const currentIndex = breakpointOrder.indexOf(current);
    if (currentIndex === -1) return [];

    // сначала ищем вниз (меньшие breakpoints)
    for (let i = currentIndex - 1; i >= 0; i--) {
        const layout = layouts[breakpointOrder[i]];
        if (layout?.[0]) return layout;
    }

    // потом вверх (большие breakpoints)
    for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
        const layout = layouts[breakpointOrder[i]];
        if (layout?.[0]) return layout;
    }

    return [];
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//       создание ячеек
/////////////////////////////////////////////////////////////////////////////////////////////////
export function canPlace(
    x: number,
    y: number,
    w: number,
    h: number,
    all: LayoutCustom[]
): boolean {
    return !all.some((cell) => {
        return (
            x < cell.x + cell.w &&
            x + w > cell.x &&
            y < cell.y + cell.h &&
            y + h > cell.y
        );
    });
}
export function findFreeSpot(w: number, h: number, all: LayoutCustom[], maxCols = 12): { x: number, y: number } | null {
    const maxY = Math.max(0, ...all.map(cell => cell.y + cell.h));

    for (let y = 0; y <= maxY + 5; y++) {
        for (let x = 0; x <= maxCols - w; x++) {
            if (canPlace(x, y, w, h, all)) {
                return { x, y };
            }
        }
    }

    return null;
}
export function findLowestY(cells: LayoutCustom[]): number {
    if (!cells.length) return 0;

    return Math.max(...cells.map(cell => cell.y + cell.h));
}


export const stackHorizont = (countW: number, containerHeight: number, rowHeight: number, margin: [number, number]): LayoutCustom[] => {
    const currentBreakpoint = editorContext.size.breackpoint.get();
    const layout = editorContext.layouts[currentBreakpoint].get();
    const cellW = Math.floor(12 / countW); // ширина в колонках
    const cellH = Math.floor((containerHeight + margin[1]) / (rowHeight + margin[1])); // высота в строках
    const y = findLowestY(layout); // если нужно добавить снизу
    
    return Array.from({ length: countW }, (_, i) => ({
        i: `cell-${Date.now()}-${i}`,
        x: i * cellW,
        y: y,
        w: cellW,
        h: cellH,
        content: []
    }));
}
export const stackVertical = (countH: number, containerHeight: number, rowHeight: number, margin: [number, number]): LayoutCustom[] => {
    const currentBreakpoint = editorContext.size.breackpoint.get();
    const layout = editorContext.layouts[currentBreakpoint].get();
    const maxCols = 12;

    const totalRows = Math.floor((containerHeight + margin[1]) / (rowHeight + margin[1]));
    const cellH = Math.floor(totalRows / countH);

    const usedXs = new Set<number>();
    for (const cell of layout) {
        for (let i = 0; i < cell.w; i++) {
            usedXs.add(cell.x + i);
        }
    }

    // Найти первый незанятый столбец слева направо
    let targetX: number | null = null;
    for (let x = 0; x <= maxCols - 1; x++) {
        if (![...Array(1).keys()].every((dx) => usedXs.has(x + dx))) {
            targetX = x;
            break;
        }
    }

    if (targetX === null || targetX >= maxCols) {
        console.warn("⛔ Нет свободного вертикального столбца");
        return [];
    }

    // Начать с нижней границы по этому x
    const relevantCells = layout.filter(c => c.x <= targetX && c.x + c.w > targetX);
    const yStart = relevantCells.length
        ? Math.max(...relevantCells.map(c => c.y + c.h))
        : 0;

    return Array.from({ length: countH }, (_, i) => ({
        i: `cell-${Date.now()}-${i}`,
        x: targetX,
        y: yStart + i * cellH,
        w: 1,
        h: cellH,
        content: []
    }));
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//       dom function
/////////////////////////////////////////////////////////////////////////////////////////////////
export function getMaxBottomCoordinate(container: Element) {
    const children = container.children;
    let maxBottom = 0;

    [...children].forEach((el) => {
        const bottom = el.getBoundingClientRect().y;

        if (bottom > maxBottom) {
            maxBottom = bottom;
        }
    });

    return maxBottom;
}
/** преобразователь в относительные размеры (%) */
export function getRelativeStylePercent(style, parentWidth, parentHeight) {
    return {
        ...style,
        position: 'absolute',
        top: Math.round((style.y / parentHeight) * 100) + '%',
        left: Math.round((style.x / parentWidth) * 100) + '%',
        width: typeof style.width === 'number'
            ? Math.round((style.width / parentWidth) * 100) + '%'
            : style.width,
        height: typeof style.height === 'number'
            ? Math.round((style.height / parentHeight) * 100) + '%'
            : style.height,
        zIndex: Math.round(style.y),
    };
}