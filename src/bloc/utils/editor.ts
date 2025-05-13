import { Component, LayoutCustom } from '../type';
import { useRenderState } from "../context";


export function getComponentById(id: number): Component | undefined {
    const renderState = useRenderState();
    let result;

    renderState.get({ noproxy: true }).forEach((layer) => {  
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

