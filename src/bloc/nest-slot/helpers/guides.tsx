import { guidesSlice } from "../context";


export function addGuide(axis: 'x' | 'y', value: number) {
    const list = guidesSlice[axis].get();
    
    if (!list.includes(value)) {
        guidesSlice[axis].set(prev => [...prev, value].sort((a, b) => a - b));
    }
}
export function removeGuide(axis: 'x' | 'y', value: number) {
    guidesSlice[axis].set(prev => prev.filter(v => v !== value));
}

export function snapToGuides(value: number, guides: number[], threshold = 5): number {
    for (const guide of guides) {
        if (Math.abs(value - guide) <= threshold) {
            return guide;
        }
    }
    return value;
}