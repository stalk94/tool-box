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

