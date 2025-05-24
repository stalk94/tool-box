import { Component, LayoutCustom } from '../type';
import { renderSlice } from "../context";


export function getComponentById(id: number): Component | undefined {
    let result;

    renderSlice.get().forEach((layer) => {  
        const find = layer.content?.find?.((elem)=> elem.props['data-id'] === id);
        if(find) result = find;
    });
    
    return result;
}

export function getUniqueBlockName(baseName: string, existingNames: string[]): string {
    let name = baseName;
    let counter = 1;

    while (existingNames.includes(name)) {
        name = `${baseName}-${counter}`;
        counter++;
    }

    return name;
}


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
    const cellW = Math.floor(12 / countW); // ширина в колонках
    const cellH = Math.floor((containerHeight + margin[1]) / (rowHeight + margin[1])); // высота в строках
    const y = findLowestY(renderSlice.get()); // если нужно добавить снизу

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
    const cells = renderSlice.get();
    const maxCols = 12;

    const totalRows = Math.floor((containerHeight + margin[1]) / (rowHeight + margin[1]));
    const cellH = Math.floor(totalRows / countH);

    const usedXs = new Set<number>();
    for (const cell of cells) {
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
    const relevantCells = cells.filter(c => c.x <= targetX && c.x + c.w > targetX);
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