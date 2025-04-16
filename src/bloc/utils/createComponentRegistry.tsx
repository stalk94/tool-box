import React from 'react';
import { componentMap, componentDefaults } from '../modules/utils/registry';



export function createComponentFromRegistry(type: string): React.ReactNode {
    const Component = componentMap[type];
    const props = { ...componentDefaults[type] };
  
    const id = Date.now();
    props['data-id'] = id;
    props['data-type'] = type;
  
    return <Component {...props} />;
}