import React from 'react';
import { ComponentRegister } from '../../type';


const internalComponentMap: Record<string, React.FC<any>> = {};
const defaultPropsMap: Record<string, Record<string, any>> = {};
const registry: Record<string, Omit<ComponentRegister, 'component' | 'defaultProps'>> = {};

export function registerComponent(def: ComponentRegister) {
    internalComponentMap[def.type] = def.component;
    defaultPropsMap[def.type] = def.defaultProps ?? {};
    
   
    registry[def.type] = {
        type: def.type,
        icon: def.icon,
        category: def.category,
        description: def.description ?? def.type,
    };
}


/** неоюходимо только для левой tool панели */
export const componentsRegistry = registry;
export const componentMap = internalComponentMap;
/** необходимо только в createComponents */
export const componentDefaultsProps = defaultPropsMap;