import React from 'react';
import { componentMap, componentDefaultsProps } from '../modules/utils/registry';
import { Component } from '../type';
import { Chip } from '@mui/material';


// неоюходим при создании нового компонента в рабочей области (применяется только в App)
export function createComponentFromRegistry(type: string): Component {
    const Component = componentMap[type];
    const props = { ...componentDefaultsProps[type] };
    console.log(Component)
  
    const id = Date.now();
    props['data-id'] = id;
    props['data-type'] = type;
  
    return <Component {...props} />;
}