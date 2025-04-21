import { renderState, cellsContent } from '../context';
import { Component } from '../type';



export function getComponentById(id: number): Component | undefined {
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

export const fetchFolders = async (): Promise<string[]> => {
    const res = await fetch('/list-folders');
    if (!res.ok) throw new Error('Ошибка загрузки');
    return res.json();
}