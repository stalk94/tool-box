import React from 'react';
import { componentMap, componentDefaultsProps } from '../modules/helpers/registry';
import { ComponentProps, DataRegisterComponent } from '../type';



// неоюходим при создании нового компонента в рабочей области (применяется только в App)
export function createComponentFromRegistry(type: string): DataRegisterComponent {
    const Component = componentMap[type];
    const props = { ...componentDefaultsProps[type] };
    console.log(Component)
  
    const id = Date.now();
    props['data-id'] = id;
    props['data-type'] = type;
  
    return {
        Component,
        props
    };
}