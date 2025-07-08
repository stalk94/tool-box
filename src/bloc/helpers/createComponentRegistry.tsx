import React from 'react';
import { componentMap, componentDefaultsProps, componentsRegistry } from '../modules/helpers/registry';
import { ComponentProps, DataRegisterComponent } from '../type';



// неоюходим при создании нового компонента в рабочей области (применяется только в App)
export function createComponentFromRegistry(type: string): DataRegisterComponent {
    const Component = componentMap[type];
    const props = { ...componentDefaultsProps[type] };
    
   
    const id = Date.now();
    props['data-id'] = id;
    props['data-type'] = type;
  
    return {
        Component,
        props
    };
}