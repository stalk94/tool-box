import React from 'react';
import { ComponentRegister, ProxyComponentName } from '../../type';


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
        config: def.config
    };
}


/** неоюходимо только для левой tool панели */
export const componentsRegistry: Record<ProxyComponentName, Omit<ComponentRegister, 'component' | 'defaultProps'>> = registry;
export const componentMap: Record<ProxyComponentName, React.FC<any>> = internalComponentMap;
/** необходимо только в createComponents */
export const componentDefaultsProps = defaultPropsMap;